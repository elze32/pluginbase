import Groq from 'groq-sdk'
import { prisma } from '../lib/prisma.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const CACHE_DAYS = 30

interface RawFiche {
  description: string
  useCases: string[]
  parameters: Array<{ name: string; shortExplanation: string; tips: string }>
  beginnerTip: string
  proTip: string
  pairsWellWith: string[]
  alternatives: string[]
}

function makePluginKey(normalizedName: string, brand: string | null | undefined): string {
  const brandPart = brand ? brand.toLowerCase().trim().replace(/\s+/g, '-') : 'unknown'
  return `${normalizedName}_${brandPart}`
}

async function callGroq(pluginName: string, brand: string, category: string): Promise<RawFiche> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1500,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: `Tu es un expert en production musicale, mixage et sound design avec 15 ans d'expérience en studio.
Tu connais parfaitement tous les plugins audio professionnels et tu sais exactement comment les producteurs les utilisent.
Tes explications sont concrètes, musicales et actionnables — tu donnes des valeurs précises, des exemples de genres musicaux, des techniques réelles de studio.
Tu parles français naturellement, pas comme un manuel technique.
Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans texte avant ou après.`,
      },
      {
        role: 'user',
        content: `Génère une fiche experte pour le plugin "${pluginName}" de ${brand} (catégorie: ${category}).

Sois très spécifique à CE plugin — ses caractéristiques propres, son son signature, ce qui le différencie des autres.
Pour les paramètres, donne les vrais noms des knobs/boutons de ce plugin.
Pour les conseils, cite des genres musicaux précis et des valeurs de départ concrètes.

JSON exact à retourner (sans aucun texte autour) :
{
  "description": "2 phrases max — ce que ce plugin fait de UNIQUE et pourquoi les producteurs l'adorent. Sois spécifique à CE plugin.",
  "useCases": [
    "Exemple concret avec genre musical (ex: 'Ajouter de l'air sur des voix hip-hop avec un drive léger')",
    "Exemple concret 2",
    "Exemple concret 3"
  ],
  "parameters": [
    {
      "name": "Nom exact du paramètre sur l'interface du plugin",
      "shortExplanation": "Ce que ça fait musicalement en une phrase simple",
      "tips": "Valeur de départ recommandée + situation musicale précise où c'est utile"
    }
  ],
  "beginnerTip": "Un conseil concret pour démarrer — avec une valeur ou un preset de départ précis",
  "proTip": "Une technique de pro avec ce plugin spécifiquement — quelque chose de non-évident",
  "pairsWellWith": ["Plugin réel 1 avec lequel il s'associe bien", "Plugin réel 2"],
  "alternatives": ["Plugin concurrent réel 1", "Plugin concurrent réel 2"]
}`,
      },
    ],
  })

  const text = completion.choices[0]?.message?.content ?? '{}'
  const clean = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
  // Décode les séquences Unicode mal encodées si présentes
  const decoded = clean.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  return JSON.parse(decoded) as RawFiche
}

export async function getOrGenerateFiche(
  pluginId: string,
  pluginName: string,
  brand: string | null | undefined,
  category: string | null | undefined
) {
  const normalizedName = pluginName.toLowerCase().trim().replace(/\s+/g, '-')
  const pluginKey = makePluginKey(normalizedName, brand)
  const brandStr = brand ?? 'Inconnu'
  const categoryStr = category ?? 'effet audio'

  // Check cache
  const cached = await prisma.pluginFiche.findUnique({ where: { pluginKey } })
  if (cached) {
    const ageMs = Date.now() - cached.generatedAt.getTime()
    const ageDays = ageMs / (1000 * 60 * 60 * 24)
    if (ageDays < CACHE_DAYS) {
      return serializeFiche(cached)
    }
  }

  // Generate with Groq
  const raw = await callGroq(pluginName, brandStr, categoryStr)

  const fiche = await prisma.pluginFiche.upsert({
    where: { pluginKey },
    update: {
      description: raw.description,
      useCasesJson: JSON.stringify(raw.useCases),
      parametersJson: JSON.stringify(raw.parameters),
      beginnerTip: raw.beginnerTip,
      proTip: raw.proTip,
      pairsWellWith: JSON.stringify(raw.pairsWellWith),
      alternatives: JSON.stringify(raw.alternatives),
      generatedAt: new Date(),
    },
    create: {
      pluginKey,
      pluginName,
      brand: brandStr,
      category: categoryStr,
      description: raw.description,
      useCasesJson: JSON.stringify(raw.useCases),
      parametersJson: JSON.stringify(raw.parameters),
      beginnerTip: raw.beginnerTip,
      proTip: raw.proTip,
      pairsWellWith: JSON.stringify(raw.pairsWellWith),
      alternatives: JSON.stringify(raw.alternatives),
    },
  })

  // Met à jour PluginMaster.descriptionFr pour afficher l'indicateur dans la liste
  await prisma.pluginMaster.updateMany({
    where: { normalizedPluginName: normalizedName },
    data: { descriptionFr: raw.description },
  })

  return serializeFiche(fiche)
}

export async function getFicheFromCache(normalizedName: string, brand: string | null | undefined) {
  const pluginKey = makePluginKey(normalizedName, brand)
  const cached = await prisma.pluginFiche.findUnique({ where: { pluginKey } })
  if (!cached) return null
  return serializeFiche(cached)
}

function serializeFiche(fiche: {
  id: string
  pluginKey: string
  pluginName: string
  brand: string | null
  category: string | null
  description: string
  useCasesJson: string
  parametersJson: string
  beginnerTip: string
  proTip: string
  pairsWellWith: string
  alternatives: string
  generatedAt: Date
}) {
  return {
    id: fiche.id,
    pluginKey: fiche.pluginKey,
    pluginName: fiche.pluginName,
    brand: fiche.brand,
    category: fiche.category,
    description: fiche.description,
    useCases: JSON.parse(fiche.useCasesJson) as string[],
    parameters: JSON.parse(fiche.parametersJson) as Array<{
      name: string
      shortExplanation: string
      tips: string
    }>,
    beginnerTip: fiche.beginnerTip,
    proTip: fiche.proTip,
    pairsWellWith: JSON.parse(fiche.pairsWellWith) as string[],
    alternatives: JSON.parse(fiche.alternatives) as string[],
    generatedAt: fiche.generatedAt.toISOString(),
  }
}
