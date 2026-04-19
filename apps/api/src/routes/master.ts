import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'

export async function masterRoutes(fastify: FastifyInstance): Promise<void> {

  // GET /api/v1/master/:name
  // Utilisé par l'overlay desktop — pas d'auth requise (lecture seule)
  fastify.get('/:name', async (request, reply) => {
    const { name } = request.params as { name: string }

    // Cherche dans PluginMaster (fuzzy sur le nom normalisé)
    const normalized = name.toLowerCase().trim().replace(/\s+/g, '-')

    const master = await prisma.pluginMaster.findFirst({
      where: {
        OR: [
          { normalizedPluginName: { contains: normalized, mode: 'insensitive' } },
          { normalizedPluginName: { contains: name, mode: 'insensitive' } },
        ],
      },
    })

    // Cherche la fiche en cache (plusieurs clés possibles)
    const possibleKeys = [
      `${normalized}_unknown`,
      normalized,
      `${normalized}_${master?.normalizedBrand ?? 'unknown'}`,
    ]

    let fiche = null
    for (const key of possibleKeys) {
      fiche = await prisma.pluginFiche.findUnique({ where: { pluginKey: key } })
      if (fiche) break
    }

    if (!master && !fiche) {
      return reply.status(404).send({ error: 'Plugin introuvable' })
    }

    const annotations = fiche?.annotationsJson
      ? (JSON.parse(fiche.annotationsJson) as unknown[])
      : []

    return reply.send({
      pluginName: fiche?.pluginName ?? master?.normalizedPluginName ?? name,
      brand: master?.normalizedBrand ?? fiche?.brand,
      category: master?.category ?? fiche?.category,
      description: fiche?.description || null,
      annotations,
    })
  })
}
