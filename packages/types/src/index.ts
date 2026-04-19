// Enums
export type PluginStatus =
  | 'UNCLASSIFIED'
  | 'ESSENTIAL'
  | 'DOUBLON'
  | 'UNUSED'
  | 'TO_LEARN'
  | 'TO_SELL'
  | 'TO_TEST'

export type UsageLevel = 'DAILY' | 'WEEKLY' | 'RARELY' | 'NEVER'

export type PluginFormat = 'VST3' | 'AU' | 'CLAP' | 'AAX'

export type PluginType = 'instrument' | 'effect' | 'utility' | 'analyzer'

export type MatchConfidence = 'exact' | 'fuzzy' | 'unknown'

// Plugin
export interface PluginInstallation {
  id: string
  userId: string
  pluginNameRaw: string
  normalizedPluginName: string
  brandRaw?: string | null
  normalizedBrand?: string | null
  format: PluginFormat
  version?: string | null
  installPath: string
  os: string
  category?: string | null
  confidence?: MatchConfidence | null
  pendingDeletion?: boolean
  pendingDeletionError?: string | null
  detectedAt: string
  state?: UserPluginState
  master?: PluginMaster
}

export interface PluginMaster {
  normalizedPluginName: string
  normalizedBrand?: string | null
  pluginType?: PluginType | null
  category?: string | null
  subcategory?: string | null
  descriptionFr?: string | null
  parametersJson?: string | null
}

export interface UserPluginState {
  id: string
  userId: string
  installationId: string
  status: PluginStatus
  favorite: boolean
  rating?: number | null
  personalNote?: string | null
  customTags: string[]
  usageEstimate?: UsageLevel | null
  purchaseInterest: boolean
  sellInterest: boolean
  updatedAt: string
}

// Auth
export interface User {
  id: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

// API
export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Dashboard stats
export interface BrandCount {
  brand: string
  count: number
}

export interface CategoryCount {
  category: string
  count: number
}

export interface DashboardStats {
  total: number
  essential: number
  doublons: number
  unused: number
  unclassified: number
  toLearn: number
  toSell: number
  toTest: number
  favorites: number
  topBrands: BrandCount[]
  topCategories: CategoryCount[]
  unknownBrandCount: number
}

// Doublons
export interface ExactDuplicateGroup {
  name: string
  brand?: string | null
  formats: string[]
  plugins: PluginInstallation[]
}

/** Catégories utilitaires en surnombre — à afficher comme conseil, pas comme doublon à supprimer */
export interface FunctionalInsight {
  category: string
  count: number
  plugins: PluginInstallation[]
}

export interface DuplicatesResponse {
  exactGroups: ExactDuplicateGroup[]
  functionalInsights: FunctionalInsight[]
  manual: PluginInstallation[]
}

// Plugin Fiche (fiches pédagogiques générées par IA)
export interface PluginParameter {
  name: string
  shortExplanation: string
  tips: string
}

export interface PluginFiche {
  id: string
  pluginKey: string
  pluginName: string
  brand?: string | null
  category?: string | null
  description: string
  useCases: string[]
  parameters: PluginParameter[]
  beginnerTip: string
  proTip: string
  pairsWellWith: string[]
  alternatives: string[]
  generatedAt: string
}

// Plugin Vision — annotations sur screenshot
export type AnnotationType = 'knob' | 'slider' | 'button' | 'display' | 'section'

export interface PluginAnnotation {
  id: string
  label: string
  short: string        // rôle en 5-8 mots, ultra direct
  explanation?: string // ancien champ — compat
  tip?: string         // ancien champ — compat
  x: number
  y: number
  type: AnnotationType
}

export interface PluginScreenshotData {
  screenshotUrl: string
  annotations: PluginAnnotation[] | null
  annotatedAt: string | null
}

// Status labels (FR)
export const STATUS_LABELS: Record<PluginStatus, string> = {
  UNCLASSIFIED: 'Non classifié',
  ESSENTIAL: 'Essentiel',
  DOUBLON: 'Doublon',
  UNUSED: 'Inutilisé',
  TO_LEARN: 'À apprendre',
  TO_SELL: 'À vendre',
  TO_TEST: 'À tester',
}
