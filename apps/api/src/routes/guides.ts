import type { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function parseGuide(guide: Record<string, unknown>) {
  let officialImageUrl = guide.officialImageUrl as string | null

  // Vérifie uniquement les images distantes ; les chemins locaux /plugins/... sont servis par Next.
  if (officialImageUrl && /^https?:\/\//.test(officialImageUrl)) {
    try {
      const check = await fetch(officialImageUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000),
      })
      if (!check.ok) officialImageUrl = null
    } catch {
      officialImageUrl = null
    }
  }

  return {
    ...guide,
    officialImageUrl,
    keyParams: JSON.parse(guide.keyParamsJson as string),
    starterPreset: JSON.parse(guide.starterPreset as string),
    pairsWith: JSON.parse(guide.pairsWith as string),
    genres: guide.genresJson ? JSON.parse(guide.genresJson as string) : [],
    references: guide.referencesJson ? JSON.parse(guide.referencesJson as string) : [],
  }
}

export async function guideRoutes(fastify: FastifyInstance) {
  // GET /api/v1/guides — liste tous les guides publiés
  fastify.get('/', async () => {
    return prisma.pluginGuide.findMany({
      where: { published: true },
      select: {
        slug: true,
        pluginName: true,
        brand: true,
        category: true,
        level: true,
        tagline: true,
      },
      orderBy: { pluginName: 'asc' },
    })
  })

  // GET /api/v1/guides/search/:name — cherche par nom (pour l'overlay et la page détail)
  // Stratégie : on charge tous les guides publiés et on compare les noms normalisés (sans espaces, minuscules)
  fastify.get<{ Params: { name: string } }>('/search/:name', async (request, reply) => {
    const { name } = request.params
    const normalized = name.toLowerCase().replace(/\s+/g, '')

    const guides = await prisma.pluginGuide.findMany({
      where: { published: true },
    })

    const guide = guides.find((g) =>
      g.pluginName.toLowerCase().replace(/\s+/g, '') === normalized ||
      g.pluginName.toLowerCase().replace(/\s+/g, '').includes(normalized) ||
      normalized.includes(g.pluginName.toLowerCase().replace(/\s+/g, ''))
    )

    if (!guide) {
      return reply.status(404).send({ error: 'No guide found' })
    }

    return await parseGuide(guide as unknown as Record<string, unknown>)
  })

  // GET /api/v1/guides/:slug — récupère un guide complet
  fastify.get<{ Params: { slug: string } }>('/:slug', async (request, reply) => {
    const { slug } = request.params

    const guide = await prisma.pluginGuide.findUnique({
      where: { slug },
    })

    if (!guide) {
      return reply.status(404).send({ error: 'Guide not found' })
    }

    return await parseGuide(guide as unknown as Record<string, unknown>)
  })
}
