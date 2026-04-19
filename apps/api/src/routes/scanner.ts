import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middlewares/authenticate.js'
import { normalizePlugin } from '../services/plugin-normalizer.js'

const scannedPluginSchema = z.object({
  pluginNameRaw: z.string().min(1),
  brandRaw: z.string().nullable().optional(),
  format: z.string(),
  version: z.string().nullable().optional(),
  installPath: z.string(),
  os: z.string(),
})

const uploadSchema = z.object({
  plugins: z.array(scannedPluginSchema).min(1),
})

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

export async function scannerRoutes(fastify: FastifyInstance): Promise<void> {

  // POST /api/v1/scanner/demo — charge 20 plugins d'exemple
  fastify.post('/demo', { preHandler: authenticate }, async (request, reply) => {
    const userId = request.user!.id

    const demoPlugins = [
      { pluginNameRaw: 'FabFilter Pro-Q 3', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'FabFilter' },
      { pluginNameRaw: 'FabFilter Pro-C 2', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'FabFilter' },
      { pluginNameRaw: 'Valhalla Supermassive', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Valhalla DSP' },
      { pluginNameRaw: 'Valhalla Room', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Valhalla DSP' },
      { pluginNameRaw: 'Serum', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Xfer Records' },
      { pluginNameRaw: 'Vital', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Matt Tytel' },
      { pluginNameRaw: 'OTT', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Xfer Records' },
      { pluginNameRaw: 'Soundtoys Decapitator', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Soundtoys' },
      { pluginNameRaw: 'Soundtoys EchoBoy', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Soundtoys' },
      { pluginNameRaw: 'iZotope Ozone 11', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'iZotope' },
      { pluginNameRaw: 'iZotope Neutron 4', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'iZotope' },
      { pluginNameRaw: 'Native Instruments Massive X', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Native Instruments' },
      { pluginNameRaw: 'Native Instruments Kontakt 7', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Native Instruments' },
      { pluginNameRaw: 'Arturia Pigments 4', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Arturia' },
      { pluginNameRaw: 'Arturia V Collection', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Arturia' },
      { pluginNameRaw: 'XLN Audio RC-20 Retro Color', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'XLN Audio' },
      { pluginNameRaw: 'Waves CLA-76', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Waves' },
      { pluginNameRaw: 'Waves SSL G-Master', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Waves' },
      { pluginNameRaw: 'Eventide Blackhole', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Eventide' },
      { pluginNameRaw: 'Kilohearts Phase Plant', format: 'VST3', installPath: 'C:\\Demo\\VST3', brand: 'Kilohearts' },
    ]

    for (const p of demoPlugins) {
      const normalized = normalizePlugin(p.pluginNameRaw)
      const normName = normalized.normalizedName || slugify(p.pluginNameRaw)
      const normBrand = slugify(p.brand)

      const existingInstallation = await prisma.pluginInstallation.findFirst({
        where: {
          userId,
          normalizedPluginName: normName,
          format: p.format,
        },
      })

      const inst = existingInstallation
        ? await prisma.pluginInstallation.update({
            where: { id: existingInstallation.id },
            data: {
              pluginNameRaw: p.pluginNameRaw,
              brandRaw: p.brand,
              normalizedBrand: normBrand,
              installPath: p.installPath,
              os: 'windows',
              category: normalized.category,
              confidence: normalized.confidence,
            },
          })
        : await prisma.pluginInstallation.create({
            data: {
              userId,
              pluginNameRaw: p.pluginNameRaw,
              normalizedPluginName: normName,
              brandRaw: p.brand,
              normalizedBrand: normBrand,
              format: p.format,
              installPath: p.installPath,
              os: 'windows',
              category: normalized.category,
              confidence: normalized.confidence,
            },
          })

      // État par défaut pour la démo
      await prisma.userPluginState.upsert({
        where: { installationId: inst.id },
        update: {},
        create: {
          userId,
          installationId: inst.id,
          status: 'UNCLASSIFIED',
        }
      })
    }

    return reply.send({ success: true, count: demoPlugins.length })
  })

  // POST /api/v1/scanner/upload — protégé par auth
  fastify.post('/upload', { preHandler: authenticate }, async (request, reply) => {
    const result = uploadSchema.safeParse(request.body)
    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors[0]?.message })
    }

    const userId = request.user!.id
    const { plugins } = result.data

    try {
      const existing = await prisma.pluginInstallation.findMany({
        where: { userId },
        select: { normalizedPluginName: true, format: true },
      })

      const existingKeys = new Set(
        existing.map((e) => `${e.normalizedPluginName}::${e.format}`)
      )

      const newPlugins = plugins
        .map((p) => {
          const norm = normalizePlugin(p.pluginNameRaw)
          const resolvedBrand = norm.brand ?? p.brandRaw ?? null
          return {
            ...p,
            normalizedPluginName: norm.normalizedName,
            normalizedBrand: resolvedBrand ? slugify(resolvedBrand) : null,
            brandRaw: resolvedBrand,
            category: norm.category,
            confidence: norm.confidence,
          }
        })
        .filter((p) => !existingKeys.has(`${p.normalizedPluginName}::${p.format}`))

      if (newPlugins.length === 0) {
        return reply.send({ data: { imported: 0, skipped: plugins.length } })
      }

      for (const p of newPlugins) {
        await prisma.pluginInstallation.create({
          data: {
            userId,
            pluginNameRaw: p.pluginNameRaw,
            normalizedPluginName: p.normalizedPluginName,
            brandRaw: p.brandRaw,
            normalizedBrand: p.normalizedBrand,
            format: p.format as any,
            version: p.version,
            installPath: p.installPath,
            os: p.os,
            category: p.category,
            confidence: p.confidence,
          }
        })
      }

      return reply.send({
        data: {
          imported: newPlugins.length,
          skipped: plugins.length - newPlugins.length,
        },
      })
    } catch (err) {
      request.log.error(err)
      return reply.status(500).send({ error: 'Erreur lors de l\'import' })
    }
  })
}
