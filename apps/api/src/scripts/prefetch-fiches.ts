/**
 * prefetch-fiches.ts
 * Pré-génère les fiches pour les 20 premiers plugins connus d'un utilisateur.
 * Rate limit : 1 fiche toutes les 2 secondes.
 * Appelé automatiquement après un scan importé.
 */
import { prisma } from '../lib/prisma.js'
import { getOrGenerateFiche, getFicheFromCache } from '../services/plugin-knowledge.js'

const RATE_LIMIT_MS = 2000
const MAX_PLUGINS = 20

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function prefetchFichesForUser(userId: string): Promise<void> {
  const installations = await prisma.pluginInstallation.findMany({
    where: { userId, confidence: { in: ['exact', 'fuzzy'] } },
    include: { master: true },
    take: MAX_PLUGINS,
    orderBy: { detectedAt: 'asc' },
  })

  let generated = 0
  for (const inst of installations) {
    const category = inst.category ?? inst.master?.category ?? null

    // Skip si déjà en cache
    const cached = await getFicheFromCache(inst.normalizedPluginName, inst.brandRaw)
    if (cached) continue

    try {
      await getOrGenerateFiche(inst.id, inst.pluginNameRaw, inst.brandRaw, category)
      generated++
      console.log(`[prefetch] ✓ ${inst.pluginNameRaw} (${generated}/${MAX_PLUGINS})`)
    } catch (err) {
      console.error(`[prefetch] ✗ ${inst.pluginNameRaw}:`, err)
    }

    if (generated < MAX_PLUGINS) {
      await sleep(RATE_LIMIT_MS)
    }
  }

  console.log(`[prefetch] Terminé — ${generated} fiche(s) générée(s) pour user ${userId}`)
}
