import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { normalizePlugin } from '../services/plugin-normalizer.js'

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {

  // POST /api/v1/admin/re-normalize — re-passe tous les plugins existants dans le normalizer
  fastify.post('/re-normalize', async (request, reply) => {
    const allInstallations = await prisma.pluginInstallation.findMany({
      select: { id: true, pluginNameRaw: true, brandRaw: true },
    })

    let updated = 0
    const masterUpdates: Map<string, { category: string | null; subcategory: string | null; pluginType: string | null; normalizedBrand: string | null }> = new Map()

    // 1. Calcul des normalisations
    const normalized = allInstallations.map((inst) => {
      const norm = normalizePlugin(inst.pluginNameRaw)
      const resolvedBrand = norm.brand ?? inst.brandRaw ?? null
      return { inst, norm, resolvedBrand }
    })

    // 2. Upsert PluginMaster EN PREMIER (contrainte FK)
    for (const { norm, resolvedBrand } of normalized) {
      if (!masterUpdates.has(norm.normalizedName)) {
        masterUpdates.set(norm.normalizedName, {
          category: norm.category,
          subcategory: norm.subcategory,
          pluginType: norm.type,
          normalizedBrand: resolvedBrand ? slugify(resolvedBrand) : null,
        })
      }
    }

    // Séquentiel pour éviter l'épuisement du pool Supabase
    for (const [normalizedPluginName, data] of masterUpdates.entries()) {
      await prisma.pluginMaster.upsert({
        where: { normalizedPluginName },
        update: {
          ...(data.category && { category: data.category }),
          ...(data.subcategory && { subcategory: data.subcategory }),
          ...(data.pluginType && { pluginType: data.pluginType }),
          ...(data.normalizedBrand && { normalizedBrand: data.normalizedBrand }),
        },
        create: {
          normalizedPluginName,
          category: data.category,
          subcategory: data.subcategory,
          pluginType: data.pluginType,
          normalizedBrand: data.normalizedBrand,
        },
      })
    }

    // 3. Update PluginInstallation après que les masters existent (séquentiel)
    for (const { inst, norm, resolvedBrand } of normalized) {
      await prisma.pluginInstallation.update({
        where: { id: inst.id },
        data: {
          brandRaw: resolvedBrand,
          normalizedBrand: resolvedBrand ? slugify(resolvedBrand) : undefined,
          normalizedPluginName: norm.normalizedName,
          category: norm.category,
          confidence: norm.confidence,
        },
      })
      updated++
    }

    return reply.send({ data: { updated, total: allInstallations.length } })
  })
}
