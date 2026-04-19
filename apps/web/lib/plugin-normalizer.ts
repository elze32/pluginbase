import { KNOWN_PLUGINS, KnownPlugin } from './plugin-knowledge';

export type PluginFormat = 'VST3' | 'AU' | 'CLAP' | 'AAX';

export interface NormalizedPlugin {
  nameRaw: string;
  displayName: string;
  brand: string | null;
  category: string | null;
  format: PluginFormat;
}

/**
 * Normalise un nom de fichier de plugin en un pattern simplifié pour le matching.
 * Idempotent, lowercase, sans extension, sans suffixes techniques, séparateurs par underscore.
 */
export function normalizePluginPattern(raw: string): string {
  return raw
    // 1. Retirer l'extension de fichier
    .replace(/\.(vst3|component|clap|aaxplugin|dll)$/i, '')
    // 2. Insérer un underscore entre lettres-minuscule/majuscule (camelCase)
    //    "ValhallaVintageVerb" -> "Valhalla_Vintage_Verb"
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    // 3. Lowercase
    .toLowerCase()
    // 4. Fixer certains noms de marques qui ne devraient pas être splittés (ex: fab_filter -> fabfilter)
    .replace(/fab_filter/g, 'fabfilter')
    // 5. Remplacer espaces, tirets, points par underscore
    .replace(/[\s\-.]+/g, '_')
    // 6. Retirer suffixes techniques fréquents (mais PAS les chiffres du nom)
    .replace(/_(x64|x86|64bit|32bit|vst|vst3|au|aax|clap)(_|$)/g, '_')
    // 7. Retirer UNIQUEMENT les patterns de version isolés (séparés par underscore)
    .replace(/_v\d+(?:[._]\d+)*(?=_|$)/g, '_')
    .replace(/_\d+[._]\d+(?:[._]\d+)*(?=_|$)/g, '_')
    // 8. Nettoyer les caractères non alphanumériques restants
    .replace(/[^a-z0-9_]/g, '')
    // 9. Compresser les underscores multiples
    .replace(/_+/g, '_')
    // 10. Retirer les underscores en début/fin
    .replace(/^_|_$/g, '');
}

/**
 * Tente de résoudre un plugin connu à partir d'un nom brut.
 */
export function resolveKnownPlugin(rawName: string): KnownPlugin | null {
  const pattern = normalizePluginPattern(rawName);
  for (const plugin of KNOWN_PLUGINS) {
    if (plugin.aliases.includes(pattern)) return plugin;
  }
  return null;
}

/**
 * Fonction principale utilisée par le scanner pour normaliser une entrée détectée.
 */
export function normalizePlugin(nameRaw: string, format: PluginFormat): NormalizedPlugin {
  const known = resolveKnownPlugin(nameRaw);

  if (known) {
    return {
      nameRaw,
      displayName: known.displayName,
      brand: known.brand,
      category: known.category,
      format
    };
  }

  // Fallback pour les plugins inconnus
  return {
    nameRaw,
    displayName: nameRaw.replace(/\.(vst3|component|clap|aaxplugin|dll)$/i, ''),
    brand: null,
    category: null,
    format
  };
}
