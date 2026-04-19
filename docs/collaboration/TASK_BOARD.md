# Suivi des taches

Derniere mise a jour : 2026-04-18

## Regles

- Mettre a jour le statut avant et apres une session.
- Utiliser un seul proprietaire courant par tache.
- Garder les descriptions courtes et actionnables.

## Legende

- `A faire`
- `En cours`
- `Bloque`
- `En revue`
- `Fait`

## Taches prioritaires

| ID | Tache | Statut | Proprietaire | Derniere maj | Prochain pas |
|----|-------|--------|--------------|--------------|--------------|
| COLLAB-001 | Mettre en place la memoire partagee multi-agents et les regles Cursor | Fait | Codex | 2026-04-15 | Verifier que le protocole est suivi dans les prochaines sessions |
| COLLAB-002 | Integrer `ROLES.md` dans le parcours de reprise multi-agents | Fait | Codex | 2026-04-15 | Lire `ROLES.md` des le debut des prochaines sessions pour mieux repartir le travail |
| GUIDE-IMG-001 | Precharger localement les visuels des fiches guides et preparer les prochains plugins populaires | Fait | Codex | 2026-04-15 | Verifier visuellement les pages guide et remplacer les captures fallback par des screenshots fabricant plus propres si disponibles |
| CORE-001 | Verifier que l'architecture reelle du depot reste alignee avec `AGENTS.md` | Fait | Gemini | 2026-04-15 | Audit des dossiers apps/ effectue |
| WEB-001 | Consolider le shell principal web selon le design system PluginBase | Fait | Gemini | 2026-04-15 | Shell verifie, variables CSS bien utilisees |
| API-001 | Verifier la couverture des endpoints v1 declares dans `AGENTS.md` | Fait | Gemini | 2026-04-15 | Endpoints v1 presents et alignes avec la spec |
| FIX-API-001 | Corriger l'erreur de build TypeScript dans `plugin-vision.ts` | Fait | Gemini | 2026-04-15 | Type Buffer caste, build OK |
| WEB-002 | Refactoriser l'inventaire en Tailwind et ajouter la vue Grille | Fait | Gemini | 2026-04-16 | `PluginCard` implemente, switch liste/grille OK |
| WEB-003 | Implementer la Fiche Detail "Premium" (/plugin/[id]) | Fait | Gemini | 2026-04-16 | Page refactorisee, Header immersif, PluginFicheCard et AnnotatedScreenshot en Tailwind |
| WEB-004 | Dashboard & Statistiques de collection | Fait | Gemini | 2026-04-16 | Dashboard refactorise en Tailwind, compteurs Inutilises/Doublons/A apprendre ajoutes |
| WEB-005 | Ameliorer AddPluginModal (Meta-donnees) | Fait | Gemini | 2026-04-16 | Categorie, Format et Statut ajoutes a l'ajout manuel + API mise a jour |
| WEB-006 | Implementer la page Nettoyage des Doublons (/views/doublons) | Fait | Claude Code | 2026-04-16 | Page refactorisee en Tailwind v4, actions rapides (keepVST3/deleteAll/ignore), TypeScript propre |
| APP-001 | Application Desktop Overlay (Tauri/Rust) | Fait | Gemini | 2026-04-16 | Detection in-DAW amelioree (Regex) et UI "Premium" glassmorphism |
| APP-002 | Overlay — suppression pour tous les utilisateurs | Fait | Claude Code | 2026-04-17 | Fix bug Rust toLowerCase→to_lowercase, URLs web dynamiques via VITE_WEB_URL |
| DX-002 | Fiabiliser le lancement local web+api sur une machine standard | Fait | Codex | 2026-04-16 | Garder `README.md` et les scripts racine alignes avec le flux d'installation reel |
| STAB-001 | Stabiliser la compilation web+api et resoudre les conflits de typage/routes du depot | Fait | Codex | 2026-04-18 | Surveiller les gros changements de structure web (`(dashboard)` -> `(main)`) et nettoyer separement les artefacts overlay hors code |

## Backlog

| ID | Tache | Statut | Proprietaire | Derniere maj | Prochain pas |
|----|-------|--------|--------------|--------------|--------------|
| DOC-001 | Completer la documentation de `apps/overlay` et `apps/scanner` | Fait | Gemini | 2026-04-15 | Clarification faite dans PROJECT_CONTEXT.md |
| DX-001 | Ajouter une routine explicite de verification en fin de session | Fait | Gemini | 2026-04-16 | Routine appliquee avec succes |
