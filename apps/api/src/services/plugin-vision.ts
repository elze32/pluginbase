import Groq from 'groq-sdk'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface PluginAnnotation {
  id: string
  label: string
  short: string
  x: number
  y: number
  type: 'knob' | 'slider' | 'button' | 'display'
}

export async function analyzePluginScreenshot(
  imagePath: string,
  pluginName: string,
  brand: string
): Promise<PluginAnnotation[]> {

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image introuvable : ${imagePath}`)
  }

  console.log('[vision] path:', imagePath)
  console.log('[vision] size:', fs.statSync(imagePath).size, 'bytes')

  // Compresser si > 4 MB (limite Groq)
  const initialBuffer = fs.readFileSync(imagePath)
  let imageBuffer: Buffer = initialBuffer
  if (initialBuffer.length > 4 * 1024 * 1024) {
    imageBuffer = await sharp(initialBuffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer() as Buffer
    console.log('[vision] compressé à:', imageBuffer.length, 'bytes')
  }

  const base64Image = imageBuffer.toString('base64')
  const ext = path.extname(imagePath).toLowerCase()
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg'

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.2-11b-vision-preview', // Correction du modèle
      max_tokens: 1500,
      temperature: 0.2,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64Image}` },
          },
          {
            type: 'text',
            text: `Tu analyses l'interface du plugin "${pluginName}" de ${brand}.

Identifie chaque bouton/knob/slider visible.
Pour chaque élément :
- label : nom exact écrit sur l'interface
- short : rôle en 5-8 mots MAX, ultra direct, en français
- x, y : position en % sur l'image (x: gauche=0 droite=100, y: haut=0 bas=100)
- type : knob | slider | button | display

Réponds UNIQUEMENT avec ce JSON strict (sans markdown, sans backticks) :
{"annotations":[{"id":"1","label":"MIX","short":"Dos/face son sec et traité","x":72,"y":58,"type":"knob"}]}`,
          },
        ],
      }],
    })

    const rawText = (completion.choices[0]?.message?.content ?? '{}')
      .replace(/```json|```/g, '')
      .trim()

    console.log('[vision] réponse (100 chars):', rawText.slice(0, 100))

    const parsed = JSON.parse(rawText) as { annotations: PluginAnnotation[] }
    return parsed.annotations
  } catch (error) {
    console.error('[vision] Groq Error:', error)
    throw new Error('Erreur lors de l\'analyse visuelle. Vérifiez la configuration Groq.')
  }
}
