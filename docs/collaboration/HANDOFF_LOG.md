# Journal de passation

Journal append-only. La derniere entree est la source la plus utile pour reprendre rapidement.

## 2026-04-15 17:05 - Codex -> Claude Code ou Codex

## Handoff Entry

### What was done
- Mise en place du protocole de collaboration multi-agents dans le depot.
- Ajout d'une section de protocole multi-agents dans `AGENTS.md`.
- Creation de regles Cursor obligatoires dans `.cursor/rules/multi-agent-protocol.mdc`.
- Creation du dossier `docs/collaboration/` avec regles, contexte, tableau de taches, template et journal.
- Transformation de `CLAUDE.md` en point d'entree leger vers `AGENTS.md`.
- Aucun test applicatif lance, travail documentaire uniquement.

### Files modified
- `AGENTS.md`
- `CLAUDE.md`
- `.cursor/rules/multi-agent-protocol.mdc`
- `docs/collaboration/README.md`
- `docs/collaboration/WORKING_RULES.md`
- `docs/collaboration/PROJECT_CONTEXT.md`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_TEMPLATE.md`
- `docs/collaboration/HANDOFF_LOG.md`
- `docs/collaboration/DECISIONS.md`

### Decisions made
- `AGENTS.md` devient explicitement le protocole central partage entre Codex et Claude Code.
- La memoire operationnelle d'equipe est centralisee dans `docs/collaboration/`.
- `CLAUDE.md` n'est plus une source de verite concurrente et sert de point d'entree.

### Risks / warnings
- `AGENTS.md` et `CLAUDE.md` existaient deja with un contenu presque duplique ; la duplication a ete reduite mais il faudra maintenir la discipline dans les prochaines sessions.
- La structure reelle du depot contient `apps/overlay` et `apps/scanner`, qui meritent une clarification vis-a-vis de l'architecture cible documentee.

### Next recommended step
- Utiliser ce protocole sur une vraie tache produit.
- Auditer l'alignement entre le depot actuel et `AGENTS.md`.

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-16 16:50 - Codex -> Claude Code ou Codex

## Handoff Entry

### What was done
- Fiabilisation du demarrage local pour `web` et `api` sur une machine standard.
- Correction des scripts racine `pnpm dev`, `pnpm build`, `pnpm lint` et `pnpm type-check` qui ne ciblaient aucun workspace.
- Ajout du chargement automatique de `apps/api/.env` via `dotenv` pour eviter un demarrage casse sur une machine neuve.
- Ajout des scripts `type-check` dans `apps/web` et `apps/api`.
- Correction des erreurs ESLint/TypeScript bloquantes dans le frontend (dashboard, inventaire, vues essentielles/inutilises, doublons, composants plugin).
- Migration des polices Google du `head` HTML vers `next/font/google` avec `display: swap`.
- Ajout du parametre `turbopack.root` pour stabiliser le build Next.js dans ce workspace.
- Mise a jour du `README.md` avec un flux d'installation/lancement realiste pour un nouveau poste.

### Files modified
- `package.json`
- `README.md`
- `AGENTS.md`
- `apps/api/package.json`
- `apps/api/src/index.ts`
- `apps/web/package.json`
- `apps/web/eslint.config.mjs`
- `apps/web/next.config.ts`
- `apps/web/app/layout.tsx`
- `apps/web/app/globals.css`
- `apps/web/app/(dashboard)/dashboard/page.tsx`
- `apps/web/app/(dashboard)/inventory/page.tsx`
- `apps/web/app/(dashboard)/scanner/page.tsx`
- `apps/web/app/(dashboard)/views/doublons/page.tsx`
- `apps/web/app/(dashboard)/views/essentiels/page.tsx`
- `apps/web/app/(dashboard)/views/inutilises/page.tsx`
- `apps/web/components/plugin/AddPluginModal.tsx`
- `apps/web/components/plugin/AnnotatedScreenshot.tsx`
- `apps/web/components/plugin/PluginCard.tsx`
- `apps/web/components/plugin/PluginFicheCard.tsx`
- `pnpm-lock.yaml`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Les scripts racine doivent viser explicitement `web` et `api` pour que les checks ne renvoient plus de faux positifs.
- L'API doit charger automatiquement `apps/api/.env` afin que la config locale fonctionne sans export manuel de variables.

### Tests run
- `pnpm install`
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

### Risks / warnings
- Un serveur Next.js etait deja actif dans le workspace pendant les verifications (`PID 44248`) ; je ne l'ai pas arrete pour ne pas casser l'environnement courant.
- Il reste quelques warnings ESLint non bloquants dans le frontend (`<img>` sur deux vues et un import/const inutilises) ; le lint, le type-check et le build passent malgre tout.
- Le depot contient d'autres modifications preexistantes hors de ce travail, notamment dans `apps/api`, `apps/overlay` et des screenshots uploades ; elles n'ont pas ete revert.

### Next recommended step
- Finir la passe de nettoyage des warnings ESLint restants sur la fiche plugin et `PluginRow.tsx`.
- Verifier en conditions reelles le flux complet sur une machine vierge avec une vraie base PostgreSQL configuree depuis les `.env.example`.

### Blocking issues
- Aucun blocage technique immediat sur `web` et `api`.

## 2026-04-15 17:20 - Codex -> Claude Code ou Codex

## Handoff Entry

### What was done
- Ajout de `ROLES.md` au parcours de reprise des agents.
- Mise a jour de `START_HERE.md` pour rendre la lecture de `ROLES.md` obligatoire avant planification.
- Mise a jour de la regle Cursor `.cursor/rules/multi-agent-protocol.mdc` pour inclure `ROLES.md` dans la lecture obligatoire avant tout changement de code.
- Synchronisation de la memoire d'equipe avec une nouvelle entree dans `TASK_BOARD.md` et l'index des decisions.

### Files modified
- `START_HERE.md`
- `.cursor/rules/multi-agent-protocol.mdc`
- `AGENTS.md`
- `docs/collaboration/DECISIONS.md`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- `ROLES.md` est integre au protocole de reprise comme repere de specialisation entre agents.

### Risks / warnings
- `ROLES.md` doit rester un guide leger de repartition, pas une source de verite concurrente sur le produit ou l'architecture.

### Next recommended step
- Utiliser ce protocole enrichi sur une prochaine tache reelle en tenant compte des roles recommandes.

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-15 17:25 - Codex -> Claude Code ou Codex

## Handoff Entry

### What was done
- Creation du dossier `apps/web/public/plugins` et ajout de visuels locaux pour les 10 guides actuels.
- Ajout de visuels locaux de preparation pour les plugins populaires suivants : SSL G-Master Buss Compressor, Neutron 4, EchoBoy, Pigments 4, Diva, Phase Plant, Pro-L 2, Melodyne 5, Auto-Tune Pro et RC-20 Retro Color.
- Mise a jour de `apps/api/src/scripts/seed-guides.ts` pour utiliser des chemins locaux `/plugins/...`.
- Ajout d'une entree `Arturia Pigments 4` dans `apps/api/src/data/plugin-registry.json`.
- Adaptation de `apps/api/src/routes/guides.ts` pour ne verifier par requete HEAD que les images distantes, pas les chemins locaux.
- Mise a jour de `apps/web/components/plugin/PluginGuideImage.tsx` pour utiliser `next/image`.
- Execution du reseed des guides avec succes.

### Files modified
- `apps/api/src/scripts/seed-guides.ts`
- `apps/api/src/routes/guides.ts`
- `apps/api/src/data/plugin-registry.json`
- `apps/web/components/plugin/PluginGuideImage.tsx`
- `apps/web/public/plugins/*`
- `AGENTS.md`
- `docs/collaboration/DECISIONS.md`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Les images de guides doivent etre servies localement depuis `apps/web/public/plugins/`.
- Quand un fabricant bloque le hotlink direct, une capture locale de la page officielle peut servir de fallback temporaire pour garder un visuel dans l'app.

### Risks / warnings
- Certaines sources fabricant directes renvoient 403/404 ; quelques visuels locaux sont donc des captures de pages officielles plutot que des screenshots UI purs.
- `apps/api` ne build pas completement a cause d'une erreur TypeScript preexistante dans `src/services/plugin-vision.ts`, sans rapport direct with ce travail.
- Quelques images fallback restent legeres (`kontakt-7.png`, `ozone-11.png`, `neutron-4.png`, `waves-ssl-g-master-buss-compressor.png`) et meritent d'etre remplacees par des screenshots fabricant plus propres si on obtient des assets directs.

### Next recommended step
- Ouvrir les pages guide dans l'app pour verifier le rendu visuel reel des nouvelles images.
- Remplacer les captures fallback les moins qualitatives par des assets fabricant plus propres des qu'ils sont disponibles.

### Blocking issues
- Aucun blocage sur le flux guide ; blocage annexe uniquement sur le build API global a cause de `src/services/plugin-vision.ts`.

## 2026-04-15 17:45 - Gemini -> Claude Code ou Codex

## Handoff Entry

### What was done
- Audit de l'alignement de l'architecture reelle avec AGENTS.md.
- Clarification des roles de `apps/scanner` (proto Node) et `apps/overlay` (cible Tauri/Rust).
- Correction de l'erreur TypeScript dans `apps/api/src/services/plugin-vision.ts` (Type Buffer incompatible with NonSharedBuffer).
- Verification de la couverture des endpoints API v1 et du shell principal web.
- Mise a jour de PROJECT_CONTEXT.md et TASK_BOARD.md.

### Files modified
- `apps/api/src/services/plugin-vision.ts`
- `docs/collaboration/PROJECT_CONTEXT.md`
- `docs/collaboration/TASK_BOARD.md`

### Decisions made
- `apps/scanner` est maintenu comme reference fonctionnelle mais la cible de distribution est le binaire Rust issu de `apps/overlay`.

### Risks / warnings
- Le build API est maintenant OK (`tsc --noEmit` passe), mais la configuration de `groq-sdk` necessite une clef API valide (`GROQ_API_KEY`) pour fonctionner en reel.

### Next recommended step
- S'attaquer a la PHASE 1 du MVP Inventaire (ajout manuel de plugin ou amelioration de la liste).
- Definir une routine de verification DX-001.

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-16 10:15 - Gemini -> Claude Code ou Codex

## Handoff Entry

### What was done
- Refactorisation complète de `InventoryPage.tsx` et `PluginRow.tsx` pour utiliser Tailwind CSS au lieu des styles inline.
- Implémentation du mode de vue "Grille" dans l'inventaire.
- Création du composant `PluginCard.tsx` pour une représentation visuelle riche des plugins (avec images officielles).
- Ajout d'un toggle Liste/Grille persistant dans la session.
- Amélioration du Design System (utilisation rigoureuse des variables CSS via Tailwind v4).
- Définition et implémentation de la routine de vérification de fin de session (DX-001) dans `WORKING_RULES.md`.
- Mise à jour du `TASK_BOARD.md` (WEB-002 et DX-001 marqués comme Fait).

### Files modified
- `apps/web/app/(dashboard)/inventory/page.tsx`
- `apps/web/components/plugin/PluginRow.tsx`
- `apps/web/components/plugin/PluginCard.tsx` (nouveau)
- `docs/collaboration/WORKING_RULES.md`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Utilisation de Tailwind CSS comme standard exclusif pour les nouveaux composants et le refactoring.
- La vue Grille devient le mode privilégié pour l'exploration visuelle, tandis que la Liste reste pour la gestion en masse.
- Mise en place d'une routine obligatoire (DX-001) pour garantir la qualité des passations.

### Risks / warnings
- Les images de plugins dans la vue Grille utilisent un mapping basé sur `normalizedPluginName`. Si le fichier n'existe pas dans `public/plugins/`, un placeholder SVG est affiché. Il faudra continuer d'enrichir la bibliothèque d'images.

### Next recommended step
- Continuer la PHASE 1 du MVP Inventaire : finaliser le formulaire d'ajout manuel (AddPluginModal) pour inclure plus de métadonnées si nécessaire.
- Tester la réactivité de la grille sur différents formats d'écran.

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-16 11:30 - Gemini -> Claude Code ou Codex

## Handoff Entry

### What was done
- Refonte complète de la **Fiche Détail du Plugin** (`/plugin/[id]`) with un design "Premium".
- Création d'un **Header immersif** with arrière-plan visuel flouté, badge de catégorie dynamique et barre d'actions (statut, favori).
- Refactorisation de `PluginFicheCard.tsx` with Tailwind CSS (meilleure hiérarchie des sections, icônes, animations).
- Refactorisation de `AnnotatedScreenshot.tsx` with Tailwind CSS (marqueurs interactifs améliorés, bulles d'info en verre dépoli).
- Mise en place d'une **Sidebar de gestion personnalisée** (évaluation par étoiles, fréquence d'usage, auto-save des notes, métadonnées techniques).
- Intégration complète de la génération de fiche IA et de l'analyse visuelle Claude Vision dans le flux utilisateur.

### Files modified
- `apps/web/app/(dashboard)/plugin/[id]/page.tsx`
- `apps/web/components/plugin/PluginFicheCard.tsx`
- `apps/web/components/plugin/AnnotatedScreenshot.tsx`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Adoption d'un layout 8/12 - 4/12 pour la fiche détail pour séparer le contenu éducatif (IA) de la gestion personnelle.
- Utilisation systématique de Tailwind v4 pour le refactoring "Premium".

### Risks / warnings
- La génération de fiche dépend de l'API `/api/v1/plugins/:id/fiche` qui peut être lente selon le moteur de connaissance. Un état de chargement élégant a été ajouté.

### Next recommended step
- **Option 3 (Dashboard)** : Créer la vue d'ensemble with les statistiques de collection.
- **Option 2 (AddPluginModal)** : Enrichir l'ajout manuel with les catégories et formats.

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-16 12:45 - Gemini -> Claude Code ou Codex

## Handoff Entry

### What was done
- Implémentation du **Premium Studio Dashboard** (`/dashboard`).
- Création de **compteurs KPIs haute visibilité** pour les plugins Inutilisés, les Doublons et les outils "À apprendre" prioritaires.
- Ajout d'une **barre de progression d'hygiène de collection** (plugins qualifiés vs non-identifiés).
- Intégration de **graphiques visuels (bar charts)** pour la distribution par catégories et fabricants.
- Ajout d'un **bloc de conseils dynamiques** s'adaptant à l'état réel de la collection utilisateur.
- Refactorisation complète en Tailwind CSS v4 pour une cohérence esthétique "Premium".

### Files modified
- `apps/web/app/(dashboard)/dashboard/page.tsx`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Centralisation de la valeur utilisateur sur le dashboard via des actions correctives (tri, apprentissage, nettoyage).
- Utilisation de micro-interactions (hover, active) pour renforcer le ressenti "App native".

### Risks / warnings
- Les statistiques dépendent de la qualité du scan initial et de la classification manuelle de l'utilisateur.

### Next recommended step
- S'attaquer à l'amélioration de la `AddPluginModal` (métadonnées lors de l'ajout manuel).

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-16 13:30 - Gemini -> Claude Code ou Codex

## Handoff Entry

### What was done
- Amélioration de la **AddPluginModal** pour une saisie manuelle enrichie.
- Ajout du sélecteur de **Statut initial** (Essentiel, À apprendre, etc.) directement lors de la création.
- Refactorisation complète du modal en **Tailwind CSS** with un design aligné sur le reste de l'application Premium.
- Mise à jour de l'API (`POST /api/v1/plugins`) pour supporter la création immédiate d'un `UserPluginState` si un statut est fourni.
- Amélioration de l'ergonomie (inputs plus larges, feedback d'erreur clair, animations Radix).

### Files modified
- `apps/web/components/plugin/AddPluginModal.tsx`
- `apps/api/src/routes/plugins.ts`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Permettre à l'utilisateur de qualifier ses outils dès l'ajout manuel pour éviter une étape de tri ultérieure.
- Standardisation des composants de formulaire sur le style "Sunken" (fond légèrement grisé) du design system.

### Risks / warnings
- Aucun.

### Next recommended step
- **Exploration fonctionnelle** : S'attaquer au flux de nettoyage des doublons (vue `/views/doublons`) pour proposer des actions groupées de suppression ou de désactivation.

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-16 15:30 - Gemini -> Claude Code ou Codex

## Handoff Entry

### What was done
- Refonte de l'**Application Desktop Overlay (Tauri/Rust)**.
- **Backend Rust** : Amélioration de la détection In-DAW via Regex pour supporter plus de titres de fenêtres (Reaper, Generic). Ajout de la dépendance `regex`.
- **Frontend React** : Refonte complète de l'UI en mode "Premium Studio" with glassmorphism et accents de couleur.
- **Logique Frontend** : Amélioration du cycle de vie de l'overlay (maintien 3s après fermeture) et gestion intelligente des fiches guides/IA.
- **UX** : Ajout d'animations fluides, de micro-interactions au survol et d'un indicateur de "Live Sync".

### Files modified
- `apps/overlay/src-tauri/src/plugin_matcher.rs`
- `apps/overlay/src-tauri/Cargo.toml`
- `apps/overlay/src/App.tsx`
- `apps/overlay/src/components/OverlayPanel.tsx`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- Utilisation de styles inline de haute qualité pour l'overlay afin de ne pas alourdir le binaire Tauri tout en garantissant un look "Premium".
- Passage sur un thème sombre transparent (92% opacité) with blur (16px) pour une immersion studio parfaite.

### Risks / warnings
- La détection de fenêtres reste dépendante des titres exposés par les DAWs. Les DAWs ne renommant pas leurs fenêtres flottantes (comme Ableton dans certains cas) resteront difficiles à détecter sans driver MIDI/VSR.

### Next recommended step
- **Validation** : Compiler et tester l'overlay sur une machine avec Reaper ou FL Studio.
- **Finalisation** : S'attaquer à la page de nettoyage des doublons (avec le prompt Claude Code préparé).

### Blocking issues
- Aucun blocage technique immediat.

## 2026-04-17 09:10 - Claude Code -> Codex ou Claude Code

## Handoff Entry

### What was done
- Lancement du site : `pnpm dev` — web sur localhost:3000, api sur localhost:3001, les deux opérationnels.
- Correction bug Rust critique dans `plugin_matcher.rs` : `title.toLowerCase()` (JavaScript) → `title.to_lowercase()` (Rust) — empêchait la compilation de l'overlay.
- URLs web hardcodées `localhost:3000` remplacées par une variable dynamique `VITE_WEB_URL` dans `OverlayPanel.tsx` (liens "Détails →" et "Ajouter manuellement").
- `App.tsx` : ajout de la constante `WEB_URL` lue depuis `VITE_WEB_URL` (fallback `localhost:3000`) et passée en prop à `OverlayPanel`.
- Le système de suppression physique est complet end-to-end : chaque utilisateur se connecte dans l'overlay (LoginPanel), son token est sauvé dans `%APPDATA%\PluginBase\config.json`, le worker Rust relit la config à chaque tick et poll `/pending-deletions` avec le bon token. La suppression est déclenchée depuis le web (PluginRow > Supprimer), le fichier physique est effacé par l'overlay local, confirmé via `/confirm-deletion`.

### Files modified
- `apps/overlay/src-tauri/src/plugin_matcher.rs`
- `apps/overlay/src/App.tsx`
- `apps/overlay/src/components/OverlayPanel.tsx`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Decisions made
- `VITE_WEB_URL` est la variable d'env à définir dans `apps/overlay/.env` pour pointer vers l'URL prod de l'app web.

### Risks / warnings
- L'overlay doit être recompilé (`cargo tauri build`) pour que le fix Rust prenne effet.
- Pour la prod : `apps/overlay/.env` avec `VITE_API_URL=https://api.pluginbase.fr` et `VITE_WEB_URL=https://app.pluginbase.fr`.

### Next recommended step
- Compiler l'overlay : `cd apps/overlay && cargo tauri build`.
- Test end-to-end : connexion overlay → marquer un plugin depuis le web → vérifier suppression physique.

### Blocking issues
- Aucun blocage technique.

## 2026-04-18 23:55 - Codex -> Claude Code ou Codex

## Handoff Entry

### What was done
- Stabilisation complete du depot pour retrouver un etat de build propre sur le web et l'API.
- Correction de `apps/api/src/routes/scanner.ts` : remplacement des cles Prisma invalides par une logique `findFirst` + `create/update`, puis upsert de l'etat via `installationId`.
- Alignement des types partages avec les champs `pendingDeletion` et `pendingDeletionError` utilises par l'interface.
- Nettoyage de plusieurs erreurs front reelles : hooks conditionnels dans `DevStatusBar`, import manquant sur la page d'aide Windows, erreurs de typage dans les cartes/lignes plugins, faux code `...` dans `app/(main)/aide/page.tsx`, typage du layout Next.js, helper `scanner.ts`, tests du detecteur de doublons.
- Validation complete : lint web OK, type-check web+api OK, build de production OK, tests Vitest OK.

### Files modified
- `apps/api/src/routes/scanner.ts`
- `packages/types/src/index.ts`
- `apps/web/app/(main)/aide/page.tsx`
- `apps/web/app/(main)/aide/windows/page.tsx`
- `apps/web/app/(main)/doublons/page.tsx`
- `apps/web/app/(main)/inventaire/page.tsx`
- `apps/web/app/(main)/layout.tsx`
- `apps/web/app/(main)/plugin/[id]/page.tsx`
- `apps/web/app/(main)/scan/ScanInterface.tsx`
- `apps/web/app/page.tsx`
- `apps/web/components/dev/DevStatusBar.tsx`
- `apps/web/components/inventory/FilterSidebar.tsx`
- `apps/web/components/inventory/InventoryList.tsx`
- `apps/web/components/inventory/InventoryStats.tsx`
- `apps/web/components/plugin/AnnotatedScreenshot.tsx`
- `apps/web/components/plugin/PluginCard.tsx`
- `apps/web/components/plugin/PluginRow.tsx`
- `apps/web/hooks/useFilteredItems.ts`
- `apps/web/lib/__tests__/duplicate-detector.test.ts`
- `apps/web/lib/duplicate-detector.ts`
- `apps/web/lib/logger.ts`
- `apps/web/lib/plugin-knowledge.ts`
- `apps/web/lib/scanner.ts`
- `docs/collaboration/TASK_BOARD.md`
- `docs/collaboration/HANDOFF_LOG.md`

### Tests run
- `pnpm lint`
- `pnpm type-check`
- `pnpm build`
- `pnpm --filter web test`

### Decisions made
- Aucune nouvelle decision produit/stack durable : uniquement de la remise en coherence de l'existant.

### Risks / warnings
- Le worktree reste tres charge et contient beaucoup de changements non lies a cette session, notamment autour de `apps/overlay`, des anciens fichiers `(dashboard)` supprimes et d'artefacts de build/outputs locaux. Je n'y ai pas touche pour ne pas ecraser un travail deja en cours.
- Le build web passe avec les routes actuelles `/(main)`, mais le depot garde une trace Git importante du basculement depuis `/(dashboard)`. Un nettoyage structurel dedie sera utile avant un merge/PR.

### Next recommended step
- Faire une passe de nettoyage Git dediee et volontaire :
  1. trier les fichiers vraiment sources vs artefacts (`apps/overlay/src-tauri/target`, captures upload, anciens chemins app),
  2. confirmer la structure de routes cible (`(main)` vs `(dashboard)`),
  3. ajouter/ajuster les ignores necessaires puis preparer un commit propre.

### Blocking issues
- Aucun blocage technique sur le web/API : lint, type-check, build et tests passent.
