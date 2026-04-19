import registry from '../data/plugin-registry.json'

interface RegistryEntry {
  matchPatterns: string[]
  normalizedName: string
  brand: string
  category: string
  subcategory: string
  type: string
}

export interface NormalizeResult {
  normalizedName: string
  brand: string | null
  category: string | null
  subcategory: string | null
  type: string | null
  confidence: 'exact' | 'fuzzy' | 'unknown'
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, '-')
}

const plugins = registry.plugins as RegistryEntry[]
const brandAliases = registry.brandAliases as Record<string, string>

/**
 * Normalise un nom de plugin brut par rapport à la base de référence.
 * Priorité : match exact → match fuzzy (marque) → inconnu
 */
export function normalizePlugin(rawName: string): NormalizeResult {
  const lower = rawName.toLowerCase().trim()

  // 1. Match exact : rawName contient un des matchPatterns
  for (const entry of plugins) {
    for (const pattern of entry.matchPatterns) {
      if (lower.includes(pattern.toLowerCase())) {
        return {
          normalizedName: slugify(entry.normalizedName),
          brand: entry.brand,
          category: entry.category,
          subcategory: entry.subcategory,
          type: entry.type,
          confidence: 'exact',
        }
      }
    }
  }

  // 2. Match fuzzy : rawName contient un alias de marque connu
  for (const [alias, canonicalBrand] of Object.entries(brandAliases)) {
    const a = alias.toLowerCase()
    const idx = lower.indexOf(a)
    if (idx === -1) continue

    const charBefore = idx === 0 ? null : lower[idx - 1]
    const charAfter = idx + a.length < lower.length ? lower[idx + a.length] : null
    const validBefore = charBefore === null || /[\s\-_\./\\(]/.test(charBefore)
    const validAfter = charAfter === null || /[\s\-_\./\\)\d]/.test(charAfter)

    // Alias courts (≤3 chars) : exiger les deux frontières
    if (a.length <= 3 && !(validBefore && validAfter)) continue

    if (validBefore || idx === 0) {
      return {
        normalizedName: slugify(rawName),
        brand: canonicalBrand,
        category: null,
        subcategory: null,
        type: null,
        confidence: 'fuzzy',
      }
    }
  }

  // 3. Inconnu
  return {
    normalizedName: slugify(rawName),
    brand: null,
    category: null,
    subcategory: null,
    type: null,
    confidence: 'unknown',
  }
}
