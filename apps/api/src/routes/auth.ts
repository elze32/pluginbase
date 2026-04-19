import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prisma } from '../lib/prisma.js'
import { hashPassword, verifyPassword, generateToken } from '../lib/auth.js'
import { authenticate } from '../middlewares/authenticate.js'
import { normalizePlugin } from '../services/plugin-normalizer.js'

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

const DEMO_PLUGINS = [
  { name: 'FabFilter Pro-Q 3',          brand: 'FabFilter',          format: 'VST3', status: 'ESSENTIAL',    category: 'EQ' },
  { name: 'FabFilter Pro-C 2',          brand: 'FabFilter',          format: 'VST3', status: 'ESSENTIAL',    category: 'Compressor' },
  { name: 'Valhalla Room',              brand: 'Valhalla DSP',        format: 'VST3', status: 'ESSENTIAL',    category: 'Reverb' },
  { name: 'Valhalla Vintage Verb',      brand: 'Valhalla DSP',        format: 'VST3', status: 'DOUBLON',      category: 'Reverb' },
  { name: 'Serum',                      brand: 'Xfer Records',        format: 'VST3', status: 'ESSENTIAL',    category: 'Synthesizer' },
  { name: 'Massive X',                  brand: 'Native Instruments',  format: 'VST3', status: 'TO_LEARN',     category: 'Synthesizer' },
  { name: 'Omnisphere 2',               brand: 'Spectrasonics',       format: 'VST3', status: 'TO_LEARN',     category: 'Synthesizer' },
  { name: 'Waves SSL G-Master',         brand: 'Waves',               format: 'VST3', status: 'UNUSED',       category: 'Compressor' },
  { name: 'Waves SSL E-Channel',        brand: 'Waves',               format: 'VST3', status: 'UNUSED',       category: 'EQ' },
  { name: 'Waves CLA-76',               brand: 'Waves',               format: 'VST3', status: 'UNUSED',       category: 'Compressor' },
  { name: 'RC-20 Retro Color',          brand: 'XLN Audio',           format: 'VST3', status: 'TO_TEST',      category: 'Creative FX' },
  { name: 'Ozone 10',                   brand: 'iZotope',             format: 'VST3', status: 'TO_TEST',      category: 'Mastering' },
  { name: 'Neutron 4',                  brand: 'iZotope',             format: 'VST3', status: 'DOUBLON',      category: 'EQ' },
  { name: 'Lexicon PCM Native Reverb',  brand: 'Lexicon',             format: 'VST3', status: 'DOUBLON',      category: 'Reverb' },
  { name: 'Soundtoys EchoBoy',          brand: 'Soundtoys',           format: 'VST3', status: 'ESSENTIAL',    category: 'Delay' },
  { name: 'Soundtoys Decapitator',      brand: 'Soundtoys',           format: 'VST3', status: 'TO_LEARN',     category: 'Saturation' },
  { name: 'Arturia Pigments',           brand: 'Arturia',             format: 'VST3', status: 'UNCLASSIFIED', category: 'Synthesizer' },
  { name: 'u-he Diva',                  brand: 'u-he',                format: 'VST3', status: 'UNCLASSIFIED', category: 'Synthesizer' },
  { name: 'Melodyne 5',                 brand: 'Celemony',            format: 'VST3', status: 'UNCLASSIFIED', category: 'Pitch Correction' },
  { name: 'Auto-Tune Pro',              brand: 'Antares',             format: 'VST3', status: 'TO_SELL',      category: 'Pitch Correction' },
] as const

async function loadDemoPlugins(userId: string): Promise<number> {
  const plugins = DEMO_PLUGINS.map((p) => {
    const normalized = normalizePlugin(p.name)
    return {
      ...p,
      normalizedPluginName: normalized.normalizedName || slugify(p.name),
      normalizedBrand: slugify(p.brand),
      detectedCategory: normalized.category ?? p.category,
      subcategory: normalized.subcategory ?? null,
      pluginType: normalized.type ?? null,
      confidence: normalized.confidence,
    }
  })

  await prisma.pluginMaster.createMany({
    data: plugins.map((p) => ({
      normalizedPluginName: p.normalizedPluginName,
      normalizedBrand: p.normalizedBrand,
      category: p.detectedCategory,
      subcategory: p.subcategory,
      pluginType: p.pluginType,
    })),
    skipDuplicates: true,
  })

  const created = await prisma.$transaction(
    plugins.map((p) =>
      prisma.pluginInstallation.create({
        data: {
          userId,
          pluginNameRaw: p.name,
          normalizedPluginName: p.normalizedPluginName,
          brandRaw: p.brand,
          normalizedBrand: p.normalizedBrand,
          format: p.format as 'VST3',
          installPath: 'demo',
          os: 'demo',
          category: p.detectedCategory,
          confidence: p.confidence,
        },
      })
    )
  )

  await prisma.userPluginState.createMany({
    data: created.map((inst, i) => ({
      userId,
      installationId: inst.id,
      status: plugins[i].status as any,
      customTags: [],
    })),
    skipDuplicates: true,
  })

  return created.length
}

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court (8 caractères minimum)'),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /api/v1/auth/register
  fastify.post('/register', async (request, reply) => {
    const result = registerSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0]?.message })
    }

    const { email, password } = result.data
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return reply.status(409).send({ error: 'Cet email est déjà utilisé' })
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
      },
    })

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
    await prisma.session.create({
      data: { userId: user.id, token, expiresAt },
    })

    return reply.status(201).send({
      data: {
        user: { id: user.id, email: user.email, createdAt: user.createdAt },
        token,
      },
    })
  })

  // POST /api/v1/auth/guest — crée un compte invité + charge 20 plugins démo
  fastify.post('/guest', async (request, reply) => {
    const id = randomBytes(8).toString('hex')
    const email = `guest_${id}@demo.pluginbase.io`
    const password = randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
      },
    })

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    await prisma.session.create({
      data: { userId: user.id, token, expiresAt },
    })

    await loadDemoPlugins(user.id)

    return reply.status(201).send({
      data: {
        user: { id: user.id, email: user.email, createdAt: user.createdAt },
        token,
      },
    })
  })

  // POST /api/v1/auth/login
  fastify.post('/login', async (request, reply) => {
    const result = loginSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: 'Données invalides' })
    }

    const { email, password } = result.data
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return reply.status(401).send({ error: 'Email ou mot de passe incorrect' })
    }

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await prisma.session.create({
      data: { userId: user.id, token, expiresAt },
    })

    return reply.send({
      data: {
        user: { id: user.id, email: user.email, createdAt: user.createdAt },
        token,
      },
    })
  })

  // POST /api/v1/auth/logout
  fastify.post('/logout', { preHandler: authenticate }, async (request, reply) => {
    const token = request.headers.authorization!.slice(7)
    await prisma.session.delete({ where: { token } }).catch(() => {})
    return reply.send({ data: { success: true } })
  })

  // GET /api/v1/auth/me
  fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
    return reply.send({ data: { user: request.user } })
  })
}
