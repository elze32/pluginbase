import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middlewares/authenticate.js'
import { getOrGenerateFiche, getFicheFromCache } from '../services/plugin-knowledge.js'
import { analyzePluginScreenshot } from '../services/plugin-vision.js'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'screenshots')

/**
 * Retourne true si le chemin ressemble à un chemin absolu vers un fichier plugin
 * réel sur le système de fichiers (Windows ou macOS).
 * Les valeurs 'demo', 'manual', les chemins relatifs ou vides → false.
 */
function isRealFilePath(installPath: string): boolean {
  if (!installPath || installPath === 'demo' || installPath === 'manual') return false
  // Windows : commence par une lettre de lecteur (C:\, D:\...)
  if (/^[A-Za-z]:[/\\]/.test(installPath)) return true
  // macOS / Linux : chemin absolu
  if (installPath.startsWith('/')) return true
  return false
}

const updateStateSchema = z.object({
  status: z
    .enum(['UNCLASSIFIED', 'ESSENTIAL', 'DOUBLON', 'UNUSED', 'TO_LEARN', 'TO_SELL', 'TO_TEST'])
    .optional(),
  favorite: z.boolean().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  personalNote: z.string().nullable().optional(),
  customTags: z.array(z.string()).optional(),
  usageEstimate: z.enum(['DAILY', 'WEEKLY', 'RARELY', 'NEVER']).nullable().optional(),
  sellInterest: z.boolean().optional(),
})

const addPluginSchema = z.object({
  pluginNameRaw: z.string().min(1),
  brandRaw: z.string().optional(),
  format: z.enum(['VST3', 'AU', 'CLAP', 'AAX']),
  version: z.string().optional(),
  category: z.string().optional(),
  status: z
    .enum(['UNCLASSIFIED', 'ESSENTIAL', 'DOUBLON', 'UNUSED', 'TO_LEARN', 'TO_SELL', 'TO_TEST'])
    .optional(),
})

export async function pluginRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate)

  // GET /api/v1/plugins/brands — liste des marques de l'utilisateur avec compteurs
  fastify.get('/brands', async (request, reply) => {
    const userId = request.user!.id

    const results = await prisma.pluginInstallation.groupBy({
      by: ['brandRaw'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    const brands = results.map((r) => ({
      brand: r.brandRaw ?? null,
      count: r._count.id,
    }))

    return reply.send({ data: brands })
  })

  // GET /api/v1/plugins
  fastify.get('/', async (request, reply) => {
    const query = request.query as Record<string, string>
    const { status, category, format, favorite, brand, search, page = '1', limit = '50' } = query

    const userId = request.user!.id
    const skip = (Number(page) - 1) * Number(limit)

    const where: Record<string, unknown> = { userId }
    if (search) {
      where.OR = [
        { pluginNameRaw: { contains: search, mode: 'insensitive' } },
        { brandRaw: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (format) where.format = format
    if (brand) {
      if (brand === '__unknown__') {
        where.brandRaw = null
      } else {
        where.brandRaw = { equals: brand, mode: 'insensitive' }
      }
    }
    if (status || favorite) {
      where.state = {}
      if (status) (where.state as Record<string, unknown>).status = status
      if (favorite === 'true') (where.state as Record<string, unknown>).favorite = true
    }
    if (category) {
      where.master = { category }
    }

    const [installations, total] = await Promise.all([
      prisma.pluginInstallation.findMany({
        where,
        include: { state: true, master: true },
        skip,
        take: Number(limit),
        orderBy: { detectedAt: 'desc' },
      }),
      prisma.pluginInstallation.count({ where }),
    ])

    return reply.send({
      data: installations,
      total,
      page: Number(page),
      limit: Number(limit),
    })
  })

  // GET /api/v1/plugins/:id
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
      include: { state: true, master: true },
    })

    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    return reply.send({ data: plugin })
  })

  // POST /api/v1/plugins (ajout manuel)
  fastify.post('/', async (request, reply) => {
    const result = addPluginSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0]?.message })
    }

    const userId = request.user!.id
    const { pluginNameRaw, brandRaw, format, version, category } = result.data

    const normalized = pluginNameRaw.toLowerCase().trim().replace(/\s+/g, '-')
    const normalizedBrand = brandRaw?.toLowerCase().trim().replace(/\s+/g, '-')

    // Upsert master record if category given
    if (category) {
      await prisma.pluginMaster.upsert({
        where: { normalizedPluginName: normalized },
        update: { category, normalizedBrand },
        create: { normalizedPluginName: normalized, normalizedBrand, category },
      })
    }

    const installation = await prisma.pluginInstallation.create({
      data: {
        userId,
        pluginNameRaw,
        normalizedPluginName: normalized,
        brandRaw,
        normalizedBrand,
        format,
        version,
        installPath: 'manual',
        os: 'manual',
      },
      include: { state: true, master: true },
    })

    return reply.status(201).send({ data: installation })
  })

  // GET /api/v1/plugins/:id/fiche
  fastify.get('/:id/fiche', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
      include: { master: true },
    })
    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const category = plugin.category ?? plugin.master?.category ?? null
    const fiche = await getOrGenerateFiche(
      plugin.id,
      plugin.pluginNameRaw,
      plugin.brandRaw,
      category
    )

    return reply.send({ data: fiche })
  })

  // GET /api/v1/plugins/:id/fiche/status — vérifie si une fiche est déjà en cache
  fastify.get('/:id/fiche/status', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const cached = await getFicheFromCache(plugin.normalizedPluginName, plugin.brandRaw)
    return reply.send({ data: { hasFiche: cached !== null } })
  })

  // PATCH /api/v1/plugins/:id/state
  fastify.patch('/:id/state', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const result = updateStateSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0]?.message })
    }

    const installation = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!installation) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const state = await prisma.userPluginState.upsert({
      where: { installationId: id },
      update: result.data,
      create: {
        userId,
        installationId: id,
        ...result.data,
        status: result.data.status ?? 'UNCLASSIFIED',
        customTags: result.data.customTags ?? [],
      },
    })

    return reply.send({ data: state })
  })

  // POST /api/v1/plugins/:id/screenshot — upload d'une image
  fastify.post('/:id/screenshot', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    // Récupère le fichier multipart
    const data = await request.file()
    if (!data) {
      return reply.status(400).send({ error: 'Aucun fichier reçu' })
    }

    const mimeType = data.mimetype
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(mimeType)) {
      return reply.status(400).send({ error: 'Format non supporté. PNG ou JPG uniquement.' })
    }

    const ext = mimeType === 'image/png' ? '.png' : '.jpg'
    const filename = `${id}_${Date.now()}${ext}`
    const filePath = path.join(UPLOADS_DIR, filename)

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    }

    await pipeline(data.file, fs.createWriteStream(filePath))

    const screenshotUrl = `/uploads/screenshots/${filename}`

    // Détermine la clé fiche
    const normalizedName = plugin.normalizedPluginName
    const brandPart = plugin.brandRaw
      ? plugin.brandRaw.toLowerCase().trim().replace(/\s+/g, '-')
      : 'unknown'
    const pluginKey = `${normalizedName}_${brandPart}`

    // Stocke l'URL dans PluginFiche (upsert)
    await prisma.pluginFiche.upsert({
      where: { pluginKey },
      update: { screenshotUrl, annotationsJson: null, annotatedAt: null },
      create: {
        pluginKey,
        pluginName: plugin.pluginNameRaw,
        brand: plugin.brandRaw ?? 'Inconnu',
        category: plugin.category ?? null,
        description: '',
        useCasesJson: '[]',
        parametersJson: '[]',
        beginnerTip: '',
        proTip: '',
        pairsWellWith: '[]',
        alternatives: '[]',
        screenshotUrl,
      },
    })

    return reply.send({ data: { screenshotUrl } })
  })

  // POST /api/v1/plugins/:id/analyze-screenshot — analyse avec Claude Vision
  fastify.post('/:id/analyze-screenshot', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const normalizedName = plugin.normalizedPluginName
    const brandPart = plugin.brandRaw
      ? plugin.brandRaw.toLowerCase().trim().replace(/\s+/g, '-')
      : 'unknown'
    const pluginKey = `${normalizedName}_${brandPart}`

    const fiche = await prisma.pluginFiche.findUnique({ where: { pluginKey } })
    if (!fiche?.screenshotUrl) {
      return reply.status(400).send({ error: 'Aucune screenshot disponible pour ce plugin.' })
    }

    const filename = path.basename(fiche.screenshotUrl)
    const imagePath = path.join(UPLOADS_DIR, filename)

    console.log('[analyze] screenshotUrl:', fiche.screenshotUrl)
    console.log('[analyze] imagePath:', imagePath)
    console.log('[analyze] file exists:', fs.existsSync(imagePath))

    if (!fs.existsSync(imagePath)) {
      return reply.status(400).send({ error: 'Fichier image introuvable sur le serveur.' })
    }

    const annotations = await analyzePluginScreenshot(
      imagePath,
      plugin.pluginNameRaw,
      plugin.brandRaw ?? 'Inconnu'
    )

    await prisma.pluginFiche.update({
      where: { pluginKey },
      data: {
        annotationsJson: JSON.stringify(annotations),
        annotatedAt: new Date(),
      },
    })

    return reply.send({ data: { annotations } })
  })

  // POST /api/v1/plugins/:id/reanalyze — re-analyse l'image existante
  fastify.post('/:id/reanalyze', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const normalizedName = plugin.normalizedPluginName
    const brandPart = plugin.brandRaw
      ? plugin.brandRaw.toLowerCase().trim().replace(/\s+/g, '-')
      : 'unknown'
    const pluginKey = `${normalizedName}_${brandPart}`

    const fiche = await prisma.pluginFiche.findUnique({ where: { pluginKey } })
    if (!fiche?.screenshotUrl) {
      return reply.status(400).send({ error: 'Aucune screenshot disponible pour ce plugin.' })
    }

    const filename = path.basename(fiche.screenshotUrl)
    const imagePath = path.join(UPLOADS_DIR, filename)

    if (!fs.existsSync(imagePath)) {
      return reply.status(400).send({ error: 'Fichier image introuvable sur le serveur.' })
    }

    const annotations = await analyzePluginScreenshot(
      imagePath,
      plugin.pluginNameRaw,
      plugin.brandRaw ?? 'Inconnu'
    )

    await prisma.pluginFiche.update({
      where: { pluginKey },
      data: {
        annotationsJson: JSON.stringify(annotations),
        annotatedAt: new Date(),
      },
    })

    return reply.send({ data: { annotations } })
  })

  // GET /api/v1/plugins/:id/screenshot — récupère URL + annotations
  fastify.get('/:id/screenshot', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const plugin = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!plugin) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const normalizedName = plugin.normalizedPluginName
    const brandPart = plugin.brandRaw
      ? plugin.brandRaw.toLowerCase().trim().replace(/\s+/g, '-')
      : 'unknown'
    const pluginKey = `${normalizedName}_${brandPart}`

    const fiche = await prisma.pluginFiche.findUnique({ where: { pluginKey } })
    if (!fiche?.screenshotUrl) {
      return reply.send({ data: null })
    }

    return reply.send({
      data: {
        screenshotUrl: fiche.screenshotUrl,
        annotations: fiche.annotationsJson ? JSON.parse(fiche.annotationsJson) : null,
        annotatedAt: fiche.annotatedAt?.toISOString() ?? null,
      },
    })
  })

  // DELETE /api/v1/plugins/:id
  // Si installPath est un chemin absolu vers un fichier plugin réel, on ne supprime
  // pas immédiatement la ligne BDD : on marque pendingDeletion = true et on attend
  // la confirmation de l'app Tauri locale. Sinon (demo, manual, chemin relatif),
  // on supprime directement.
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    const userId = request.user!.id

    const installation = await prisma.pluginInstallation.findFirst({
      where: { id, userId },
    })
    if (!installation) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const needsLocalDeletion = isRealFilePath(installation.installPath)

    if (needsLocalDeletion) {
      // Soft-delete : l'app Tauri supprimera le fichier puis confirmera
      await prisma.pluginInstallation.update({
        where: { id },
        data: { pendingDeletion: true, pendingDeletionError: null },
      })
      return reply.send({ data: { success: true, pendingDeletion: true } })
    }

    // Suppression directe pour les plugins demo, manual ou sans chemin réel
    await prisma.pluginInstallation.delete({ where: { id } })
    return reply.send({ data: { success: true, pendingDeletion: false } })
  })
}
