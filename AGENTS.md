# AGENTS.md — PluginBase
## Document de référence projet · Lu en priorité à chaque session

---

## 0. COMMENT UTILISER CE FICHIER

Ce fichier est ta source de vérité absolue. Avant chaque session de travail :
1. Relis la section concernée par la tâche du jour
2. Ne dévie jamais du stack ou de l'architecture définis ici
3. Si tu as un doute, pose la question avant d'implémenter
4. Chaque décision importante prise en session doit être ajoutée à la section DÉCISIONS en bas de ce fichier

### Protocole multi-agents

`AGENTS.md` est le protocole central partagé entre Codex et Claude Code dans Cursor.

Avant de coder, chaque agent doit lire au minimum :
- `AGENTS.md`
- `docs/collaboration/README.md`
- `docs/collaboration/PROJECT_CONTEXT.md`
- `docs/collaboration/TASK_BOARD.md`
- la dernière entrée de `docs/collaboration/HANDOFF_LOG.md`

Avant de terminer une session, chaque agent doit :
- mettre à jour `docs/collaboration/TASK_BOARD.md`
- ajouter une entrée dans `docs/collaboration/HANDOFF_LOG.md`
- documenter dans la section DÉCISIONS de ce fichier toute décision produit, UX, stack ou architecture qui change le projet durablement

En cas de divergence entre plusieurs documents, l'ordre de priorité est :
1. `AGENTS.md`
2. `docs/collaboration/WORKING_RULES.md`
3. `docs/collaboration/PROJECT_CONTEXT.md`
4. les handoffs et le tableau de tâches

---

## 1. VISION PRODUIT

**Nom** : PluginBase

**Promesse** : Aider les musiciens, producteurs et sound designers à reprendre le contrôle de leur collection de plugins — visualiser ce qu'ils possèdent, ce qui sert vraiment, ce qui fait doublon, ce qui dort, et ce qu'ils devraient arrêter d'acheter.

**Positionnement** : Un assistant de lucidité pour le studio. Pas un comparateur de prix. Pas un marketplace. Un outil de clarté.

**Utilisateurs cibles** :
- Producteurs / beatmakers (accumulation rapide de synths, effets, bundles)
- Sound designers (grande variété, besoin de cartographie)
- Compositeurs / musiciens (collection hétérogène, mémoire imparfaite)

**Différenciateur clé** : 100% en français. Fiches de plugins expliquées en contexte musical (pas technique). Seul outil de ce type sur le marché francophone.

---

## 2. STACK TECHNIQUE — RÈGLE ABSOLUE

Ne jamais dévier de ce stack sans accord explicite.

### Frontend
- **Framework** : Next.js 14+ avec App Router
- **Langage** : TypeScript strict (pas de `any`)
- **Styles** : Tailwind CSS + CSS Modules pour les composants complexes
- **UI Components** : Radix UI pour l'accessibilité (dialog, dropdown, tooltip...)
- **Animations** : Framer Motion
- **State** : Zustand pour le state global, React Query (TanStack) pour le cache API
- **Formulaires** : React Hook Form + Zod
- **Icons** : Lucide React uniquement

### Backend
- **Runtime** : Node.js avec Fastify (pas Express)
- **Langage** : TypeScript strict
- **ORM** : Prisma
- **Base de données** : PostgreSQL
- **Auth** : Better Auth (sessions JWT)
- **Validation** : Zod sur toutes les routes
- **Upload/fichiers** : Pas d'upload v1 — tout passe par le scanner local

### Scanner local (Phase 2)
- **Langage** : Rust
- **Distribution** : Binaire standalone Windows (.exe) + future app Tauri
- **Communication** : HTTP vers backend API (POST /scanner/upload)

### Infrastructure
- **Frontend** : Vercel
- **Backend** : Railway ou Render
- **Base de données** : Supabase PostgreSQL (tier gratuit pour démarrer)
- **Variables d'env** : `.env.local` (jamais commité)

### Tooling
- **Package manager** : pnpm (jamais npm ou yarn)
- **Linter** : ESLint + Prettier (config stricte)
- **Git** : Commits conventionnels (feat:, fix:, chore:, docs:)

---

## 3. DESIGN SYSTEM — LA LOI DU PROJET

L'esthétique de PluginBase est **studio professionnel, propre et respirant**. Pas sombre à l'excès. Pas générique. Pas "startup SaaS violet".

### Palette de couleurs

```css
/* Arrière-plans — clairs, pas noirs */
--bg-base: #F7F6F3;        /* Fond principal — blanc cassé chaud */
--bg-surface: #FFFFFF;     /* Cartes, panneaux */
--bg-elevated: #F0EEE9;    /* Sidebar, zones secondaires */
--bg-sunken: #E8E6E0;      /* Inputs, zones enfoncées */

/* Texte */
--text-primary: #1A1916;   /* Titres, texte principal */
--text-secondary: #6B6760; /* Labels, texte secondaire */
--text-muted: #A8A49E;     /* Placeholders, hints */

/* Accent principal — vert chartreuse studio */
--accent: #7CBF3F;         /* Actions principales */
--accent-hover: #6AAD30;
--accent-light: #EDF6E2;   /* Backgrounds accent léger */
--accent-text: #3A6B10;    /* Texte sur fond accent-light */

/* Statuts sémantiques */
--status-essential: #3A6B10;    /* Essentiel — vert foncé */
--status-essential-bg: #EDF6E2;
--status-doublon: #C0392B;      /* Doublon — rouge */
--status-doublon-bg: #FDF0EE;
--status-sleep: #6B6760;        /* Inutilisé — gris */
--status-sleep-bg: #F0EEE9;
--status-learn: #B07D2A;        /* À apprendre — ambre */
--status-learn-bg: #FDF6E8;
--status-sell: #2563EB;         /* À vendre — bleu */
--status-sell-bg: #EEF3FE;
--status-test: #7C3AED;         /* À tester — violet */
--status-test-bg: #F3EFFE;

/* Bordures */
--border: rgba(26, 25, 22, 0.08);
--border-strong: rgba(26, 25, 22, 0.14);
--border-focus: #7CBF3F;

/* Ombres */
--shadow-sm: 0 1px 2px rgba(26,25,22,0.06);
--shadow-md: 0 4px 12px rgba(26,25,22,0.08);
--shadow-lg: 0 8px 24px rgba(26,25,22,0.10);
```

### Typographie

```css
/* Titres — caractère, mémoire */
--font-display: 'Syne', sans-serif;
/* Corps — lisibilité, neutralité */
--font-body: 'Instrument Sans', sans-serif;
/* Monospace — codes, tags, méta */
--font-mono: 'DM Mono', monospace;
```

Imports Google Fonts à toujours inclure :
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Règles de design — NON NÉGOCIABLES

1. **Pas de fond noir ou très sombre** — on reste sur des blancs cassés et gris chauds
2. **Radius** : 6px pour les inputs/badges, 10px pour les cartes, 14px pour les modals
3. **Espacement** : généreux — minimum 24px entre les sections, 16px entre les éléments
4. **Borders** : toujours `1px solid var(--border)` — jamais de bordures colorées sauf focus
5. **Ombres** : légères et chaudes — jamais de box-shadow bleutés froids
6. **Animations** : subtiles, `duration: 150-200ms`, `ease-out` — jamais de bounce
7. **Icônes** : Lucide uniquement, taille 16px dans les listes, 20px dans les titres
8. **Texte sur fond coloré** : toujours utiliser `--status-*-text` sur `--status-*-bg`
9. **Loading states** : skeleton loaders, jamais de spinners
10. **Empty states** : toujours illustrés avec un message actionnable, jamais vides

### Composants récurrents à respecter

**Badge de statut** :
```tsx
<span className="status-badge status-essential">Essentiel</span>
// Toujours : fond léger + texte sombre de la même couleur
// Taille : font-size 11px, font-mono, uppercase, letter-spacing 0.06em
// Padding : 2px 8px, border-radius 4px
```

**Carte plugin** :
```
Nom du plugin (font-display, 500, 15px)
Marque · Format · Version (font-mono, 11px, muted)
[Badge statut] [Tag perso]
```

**Sidebar** :
```
Fond : --bg-elevated
Largeur : 220px fixe
Items actifs : fond --accent-light, texte --accent-text
Séparateurs : --border
```

---

## 4. ARCHITECTURE DOSSIERS

```
pluginbase/
├── AGENTS.md                 ← CE FICHIER
├── apps/
│   ├── web/                  ← Next.js frontend
│   │   ├── app/
│   │   │   ├── (auth)/       ← login, register
│   │   │   ├── (dashboard)/  ← app principale (auth requise)
│   │   │   │   ├── inventory/
│   │   │   │   ├── plugin/[id]/
│   │   │   │   ├── views/
│   │   │   │   └── settings/
│   │   │   └── page.tsx      ← landing page publique
│   │   ├── components/
│   │   │   ├── ui/           ← composants de base (Button, Badge, Input...)
│   │   │   ├── plugin/       ← PluginCard, PluginRow, PluginDetail...
│   │   │   ├── layout/       ← Sidebar, Header, Shell...
│   │   │   └── views/        ← DashboardView, InventoryView...
│   │   ├── lib/
│   │   │   ├── api.ts        ← client API
│   │   │   ├── auth.ts       ← helpers auth
│   │   │   └── utils.ts
│   │   └── stores/           ← Zustand stores
│   └── api/                  ← Fastify backend
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── middlewares/
│       │   └── index.ts
│       └── prisma/
│           └── schema.prisma
└── packages/
    └── types/                ← Types partagés frontend/backend
```

---

## 5. MODÈLE DE DONNÉES PRISMA

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  createdAt   DateTime @default(now())
  installations PluginInstallation[]
  states      UserPluginState[]
}

model PluginInstallation {
  id                   String   @id @default(cuid())
  userId               String
  pluginNameRaw        String
  normalizedPluginName String
  brandRaw             String?
  normalizedBrand      String?
  format               String   // VST3 | AU | CLAP | AAX
  version              String?
  installPath          String
  os                   String
  detectedAt           DateTime @default(now())
  user                 User     @relation(fields: [userId], references: [id])
  state                UserPluginState?
  master               PluginMaster? @relation(fields: [normalizedPluginName], references: [normalizedPluginName])
}

model PluginMaster {
  normalizedPluginName String   @id
  normalizedBrand      String?
  pluginType           String?  // instrument | effect | utility | analyzer
  category             String?  // compressor | reverb | eq | synth | delay...
  subcategory          String?
  descriptionFr        String?  // Fiche explicative en français (générée par IA)
  parametersJson       String?  // JSON des paramètres clés avec explications FR
  installations        PluginInstallation[]
}

model UserPluginState {
  id               String   @id @default(cuid())
  userId           String
  installationId   String   @unique
  status           Status   @default(UNCLASSIFIED)
  favorite         Boolean  @default(false)
  rating           Int?     // 1-5
  personalNote     String?
  customTags       String[] // array de strings
  usageEstimate    UsageLevel?
  purchaseInterest Boolean  @default(false)
  sellInterest     Boolean  @default(false)
  updatedAt        DateTime @updatedAt
  user             User     @relation(fields: [userId], references: [id])
  installation     PluginInstallation @relation(fields: [installationId], references: [id])
}

enum Status {
  UNCLASSIFIED
  ESSENTIAL
  DOUBLON
  UNUSED
  TO_LEARN
  TO_SELL
  TO_TEST
}

enum UsageLevel {
  DAILY
  WEEKLY
  RARELY
  NEVER
}
```

---

## 6. API ENDPOINTS v1

Préfixe : `/api/v1`
Auth : Header `Authorization: Bearer <token>` sur toutes les routes protégées

```
POST   /auth/register
POST   /auth/login
POST   /auth/logout

POST   /scanner/upload         ← Reçoit le JSON du scanner local

GET    /plugins                ← Liste avec filtres (status, category, brand, search, favorite)
GET    /plugins/:id            ← Détail + state + fiche FR
PATCH  /plugins/:id/state      ← Mise à jour statut, note, tags, favoris

GET    /views/dashboard        ← Stats globales (total, doublons, inutilisés, essentiels)
GET    /views/duplicates       ← Groupes de doublons détectés
GET    /views/unused           ← Plugins non classifiés ou UNUSED
GET    /views/essential        ← Plugins marqués ESSENTIAL

GET    /master/:name           ← Fiche plugin depuis le répertoire global
```

---

## 7. ORDRE DE DÉVELOPPEMENT — PHASE PAR PHASE

### PHASE 0 — Fondations (COMMENCE ICI)
**Objectif : avoir un projet qui tourne localement**

- [ ] Init monorepo avec pnpm workspaces
- [ ] Setup Next.js (app web) + Fastify (api)
- [ ] Configurer TypeScript strict sur les deux
- [ ] Setup Tailwind avec les CSS variables du design system
- [ ] Setup Prisma + connexion PostgreSQL (Supabase)
- [ ] Créer les migrations du schéma de données
- [ ] Implémenter auth basique (register, login, session)
- [ ] Shell de l'app : layout sidebar + header + zone principale

**Livrable** : On peut créer un compte, se connecter, voir une coquille d'app vide.

---

### PHASE 1 — MVP Inventaire
**Objectif : l'utilisateur peut créer et gérer son inventaire manuellement**

- [ ] Page Inventory : liste vide avec empty state qualitatif
- [ ] Ajout manuel d'un plugin (nom, marque, format, catégorie)
- [ ] PluginCard et PluginRow components
- [ ] Système de statuts (badge coloré, changement au clic)
- [ ] Favoris (toggle étoile)
- [ ] Notes personnelles (textarea inline)
- [ ] Tags personnalisés (input + chips)
- [ ] Filtres sidebar : par statut, catégorie, format, favoris
- [ ] Recherche full-text
- [ ] Page détail plugin

**Livrable** : Un utilisateur peut construire son inventaire à la main et le gérer.

---

### PHASE 2 — Scanner Windows
**Objectif : détection automatique des plugins installés**

- [ ] Binaire Rust qui scanne les chemins VST3 Windows standards
- [ ] Normalisation des noms et marques
- [ ] Export JSON des plugins détectés
- [ ] Endpoint POST /scanner/upload qui ingère les données
- [ ] UI d'onboarding : "Téléchargez le scanner, lancez-le, importez"
- [ ] Merge intelligent (évite les doublons si re-scan)

**Livrable** : L'utilisateur peut scanner son PC et voir son inventaire auto-rempli.

---

### PHASE 3 — Intelligence & Fiches FR
**Objectif : ajouter la couche connaissance**

- [ ] Fiche plugin générée par Codex API (explication FR, paramètres clés)
- [ ] Détection de doublons exacts (même nom, plusieurs formats)
- [ ] Détection de doublons fonctionnels (même catégorie, plusieurs plugins)
- [ ] Vue Doublons avec comparaison côte à côte
- [ ] Suggestions : "Tu as déjà X qui fait la même chose"
- [ ] Dashboard stats enrichi

**Livrable** : Le produit devient intelligent et différencié.

---

### PHASE 4 — Polish & Lancement
- [ ] Onboarding guidé (première connexion)
- [ ] Export de l'inventaire (CSV)
- [ ] Mode sombre (optionnel, si demandé)
- [ ] Performance : pagination, virtualisation des listes longues
- [ ] SEO de la landing page
- [ ] Analytics (Plausible, privacy-first)

---

## 8. RÈGLES DE CODE

### Nommage
- Composants : PascalCase (`PluginCard.tsx`)
- Hooks : camelCase préfixé use (`usePlugins.ts`)
- Utils : camelCase (`formatPluginName.ts`)
- Types : PascalCase suffixé par le type (`PluginStatus`, `ApiResponse<T>`)
- Variables CSS : kebab-case avec préfixe (`--color-accent`, `--font-display`)

### Composants React
- Toujours des functional components avec TypeScript
- Props typées avec interface, jamais de type inline
- Pas de `export default` sur les composants — toujours named export
- Chaque composant dans son propre fichier
- Maximum 150 lignes par composant — sinon découper

### Gestion d'erreurs
- Toutes les requêtes API wrappées dans try/catch
- Toast notifications pour les erreurs utilisateur (bibliothèque Sonner)
- Logs console uniquement en développement
- Jamais d'erreur silencieuse

### Performance
- Images : next/image systématiquement
- Fonts : next/font avec display swap
- Lazy loading : dynamic imports pour les modals et drawers lourds
- Éviter les re-renders inutiles : useMemo/useCallback seulement si profilé

---

## 9. TEXTES ET LANGUE

- **Langue de l'interface** : Français uniquement (pas de termes techniques anglais non traduits)
- **Ton** : Direct, professionnel, sans condescendance
- **Labels de statuts** :
  - ESSENTIAL → "Essentiel"
  - DOUBLON → "Doublon"
  - UNUSED → "Inutilisé"
  - TO_LEARN → "À apprendre"
  - TO_SELL → "À vendre"
  - TO_TEST → "À tester"
  - UNCLASSIFIED → "Non classifié"
- **Messages vides** : toujours actionnables. Ex: "Aucun plugin essentiel — marquez vos incontournables pour les retrouver ici."
- **Confirmation d'actions destructives** : toujours demander confirmation avec le nom exact de l'élément

---

## 10. DÉCISIONS PRISES EN SESSION

*Cette section est mise à jour au fil du projet. Chaque décision importante est documentée ici avec la date et la raison.*

| Date | Décision | Raison |
|------|----------|--------|
| 2026-04 | Fond clair (blanc cassé chaud) plutôt que dark | Trop sombre ne correspond pas à l'esthétique voulue |
| 2026-04 | Fastify plutôt que Express | Meilleure perf, TypeScript natif, schema validation intégrée |
| 2026-04 | Scanner en Rust | Accès système fichiers performant, compilation en .exe standalone |
| 2026-04 | Pas de marketplace de plugins en v1 | Garder le focus sur la lucidité, pas la vente |
| 2026-04-15 | Collaboration multi-agents pilotée par `AGENTS.md` + mémoire partagée dans `docs/collaboration/` | Éviter les divergences entre Codex et Claude Code, accélérer les reprises de session et rendre les handoffs explicites |
| 2026-04-15 | `ROLES.md` sert de repère léger de spécialisation entre agents | Aider au routage des tâches sans multiplier les consignes dans plusieurs fichiers |
| 2026-04-15 | Les fiches guides utilisent des images locales servies depuis `apps/web/public/plugins/` ; en cas de hotlink bloqué, une capture de page officielle peut servir de fallback | Garantir un affichage immédiat des visuels dans l'app même quand les URLs directes fabricant renvoient 403/404 |
| 2026-04-16 | Les scripts racine visent explicitement `web` et `api`, et l'API charge automatiquement `apps/api/.env` au démarrage | Fiabiliser le premier lancement sur une machine neuve et éviter les faux positifs de validation |

---

## 11. CONTACTS ET RESSOURCES

- **PRD complet** : voir `docs/PRD-v1.pdf`
- **Design reference** : voir section 3 de ce fichier (Design System)
- **Repo** : à définir (GitHub privé)
- **Environnements** :
  - Dev local : `localhost:3000` (web) + `localhost:3001` (api)
  - Prod : à configurer lors du déploiement

---

*Dernière mise à jour : Avril 2026*
*Ce fichier prime sur toute instruction donnée verbalement en session.*
