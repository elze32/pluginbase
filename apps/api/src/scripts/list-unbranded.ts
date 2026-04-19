import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const r = await prisma.pluginInstallation.findMany({
    where: { normalizedBrand: null },
    select: { pluginNameRaw: true },
    orderBy: { pluginNameRaw: 'asc' }
  })
  console.log(`Total sans marque: ${r.length}`)
  r.forEach((p) => console.log(p.pluginNameRaw))
}

main().catch(console.error).finally(() => prisma.$disconnect())
