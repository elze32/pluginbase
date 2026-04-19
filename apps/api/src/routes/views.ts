import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middlewares/authenticate.js'

export async function viewRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('preHandler', authenticate)

  // GET /api/v1/views/dashboard
  fastify.get('/dashboard', async (request, reply) => {
    const userId = request.user!.id

    const [total, statuses, favorites, brandCounts, unknownBrandCount] = await Promise.all([
      prisma.pluginInstallation.count({ where: { userId } }),
      prisma.userPluginState.groupBy({
        by: ['status'],
        where: { userId },
        _count: true,
      }),
      prisma.userPluginState.count({ where: { userId, favorite: true } }),
      prisma.pluginInstallation.groupBy({
        by: ['brandRaw'],
        where: { userId, brandRaw: { not: null } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.pluginInstallation.count({
        where: { userId, OR: [{ brandRaw: null }, { brandRaw: '' }] },
      }),
    ])

    const byStatus = Object.fromEntries(statuses.map((s) => [s.status, s._count]))
    const unclassified = total - statuses.reduce((sum, s) => sum + s._count, 0)

    const catRaw = await prisma.pluginInstallation.groupBy({
      by: ['category'],
      where: { userId, category: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    })

    const topBrands = brandCounts.map((b) => ({
      brand: b.brandRaw as string,
      count: b._count.id,
    }))

    const topCategories = catRaw
      .filter((c) => c.category)
      .map((c) => ({ category: c.category as string, count: c._count.id }))

    return reply.send({
      data: {
        total,
        essential: byStatus['ESSENTIAL'] ?? 0,
        doublons: byStatus['DOUBLON'] ?? 0,
        unused: byStatus['UNUSED'] ?? 0,
        unclassified,
        toLearn: byStatus['TO_LEARN'] ?? 0,
        toSell: byStatus['TO_SELL'] ?? 0,
        toTest: byStatus['TO_TEST'] ?? 0,
        favorites,
        topBrands,
        topCategories,
        unknownBrandCount,
      },
    })
  })

  // GET /api/v1/views/essential
  fastify.get('/essential', async (request, reply) => {
    const userId = request.user!.id
    const plugins = await prisma.pluginInstallation.findMany({
      where: { userId, state: { status: 'ESSENTIAL' } },
      include: { state: true, master: true },
      orderBy: { pluginNameRaw: 'asc' },
    })
    return reply.send({ data: plugins, total: plugins.length })
  })

  // GET /api/v1/views/unused
  fastify.get('/unused', async (request, reply) => {
    const userId = request.user!.id
    const plugins = await prisma.pluginInstallation.findMany({
      where: { userId, state: { status: 'UNUSED' } },
      include: { state: true, master: true },
      orderBy: { pluginNameRaw: 'asc' },
    })
    return reply.send({ data: plugins, total: plugins.length })
  })

  // GET /api/v1/views/duplicates
  fastify.get('/duplicates', async (request, reply) => {
    const userId = request.user!.id

    const allPlugins = await prisma.pluginInstallation.findMany({
      where: { userId },
      include: { state: true, master: true },
      orderBy: { pluginNameRaw: 'asc' },
    })

    // --- 1. DOUBLONS TECHNIQUES (Même plugin, formats différents) ---
    // C'est le seul vrai type de doublon "automatique"
    const byNormalizedName: Record<string, typeof allPlugins> = {}
    for (const p of allPlugins) {
      const key = p.normalizedPluginName
      if (!byNormalizedName[key]) byNormalizedName[key] = []
      byNormalizedName[key].push(p)
    }
    const exactGroups = Object.values(byNormalizedName)
      .filter((g) => g.length > 1)
      .map((plugins) => ({
        name: plugins[0].pluginNameRaw,
        brand: plugins[0].brandRaw,
        formats: plugins.map((p) => p.format),
        plugins,
      }))

    // --- 2. ANALYSE DE SUR-REPRÉSENTATION (Insights, pas des doublons à supprimer) ---
    // On ne groupe que les catégories "utilitaires" où la redondance est possible.
    // On EXCLUT les "Synthesizers", "Instruments", "Sampler" car ils sont uniques.
    const redundantCategories = ['compressor', 'eq', 'reverb', 'limiter', 'distortion', 'bitcrusher', 'preamp']
    
    const byCategory: Record<string, typeof allPlugins> = {}
    for (const p of allPlugins) {
      const cat = (p.category ?? p.master?.category ?? '').toLowerCase()
      if (!redundantCategories.includes(cat)) continue
      if (!byCategory[cat]) byCategory[cat] = []
      byCategory[cat].push(p)
    }
    
    const functionalInsights = Object.entries(byCategory)
      .filter(([, plugins]) => plugins.length >= 4) // Seulement si on en a vraiment beaucoup
      .map(([category, plugins]) => ({ 
        category, 
        count: plugins.length, 
        plugins 
      }))
      .sort((a, b) => b.count - a.count)

    // Doublons marqués manuellement par l'utilisateur
    const manual = allPlugins.filter((p) => p.state?.status === 'DOUBLON')

    return reply.send({
      data: {
        exactGroups,         // Priorité : ce qu'il faut vraiment nettoyer
        functionalInsights,  // Info : "Tu as beaucoup d'EQ, es-tu sûr de tous les utiliser ?"
        manual,              // Ce que l'utilisateur a lui-même trié
      },
      total: exactGroups.length + manual.length
    })
  })
}
