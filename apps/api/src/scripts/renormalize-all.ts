import { PrismaClient } from '@prisma/client'
import { normalizePlugin } from '../services/plugin-normalizer'

const prisma = new PrismaClient()

async function main() {
  const installations = await prisma.pluginInstallation.findMany()
  let updated = 0
  let alreadyOk = 0
  let stillUnknown = 0

  for (const inst of installations) {
    const normalized = normalizePlugin(inst.pluginNameRaw)
    if (normalized.brand) {
      await prisma.pluginInstallation.update({
        where: { id: inst.id },
        data: {
          normalizedBrand: normalized.brand,
          category: normalized.category,
          confidence: normalized.confidence,
        }
      })
      if (!inst.normalizedBrand) updated++
      else alreadyOk++
    } else {
      stillUnknown++
    }
  }

  console.log(`\n✓ ${updated} nouveaux plugins identifiés`)
  console.log(`→ ${alreadyOk} déjà identifiés (mis à jour)`)
  console.log(`✗ ${stillUnknown} encore inconnus`)
  console.log(`\nTotal : ${installations.length} plugins`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
