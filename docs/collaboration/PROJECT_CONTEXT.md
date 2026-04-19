# Contexte projet

## Resume produit

PluginBase aide les musiciens, producteurs et sound designers a comprendre leur collection de plugins audio, a identifier ce qui est essentiel, en doublon, peu utilise ou a apprendre. Le produit est pense comme un outil de clarte en francais, pas comme une marketplace.

## Source de verite

- Produit, stack, design et architecture cible : `AGENTS.md`
- Coordination quotidienne entre agents : dossier `docs/collaboration/`

## Etat reel du depot au 2026-04-15

- Monorepo `pnpm` a la racine.
- Application web dans `apps/web`.
- API Fastify dans `apps/api`.
- `apps/scanner` : Prototype Node.js/PowerShell pour le scan de plugins Windows. Sert de reference fonctionnelle pour le binaire Rust.
- `apps/overlay` : Application Tauri/Rust en cours de developpement. C'est l'evolution cible mentionnee dans `AGENTS.md` (Overlay studio, detection de fenetres, matching Rust).
- Le build de `apps/api` est desormais fonctionnel (fix du type `Buffer` dans `plugin-vision.ts`).
- `CLAUDE.md` existe au niveau racine mais doit seulement renvoyer vers `AGENTS.md` et la memoire partagee.

## Priorite produit courante

La reference produit indique que la phase active reste les fondations et le MVP d'inventaire. Toute evolution doit d'abord renforcer :
- la coherence du shell d'application
- l'inventaire manuel
- la qualite de l'experience en francais
- la discipline du design system

## Points d'attention

- Ne pas dupliquer les regles produit entre plusieurs fichiers racine.
- Verifier la coherence entre l'architecture cible de `AGENTS.md` et la structure reelle du depot avant toute refonte importante.
- Lorsqu'un agent trouve un ecart durable entre le depot et `AGENTS.md`, il doit soit corriger le code, soit documenter une decision dans `AGENTS.md`.

## Commandes utiles

- `pnpm dev`
- `pnpm dev:web`
- `pnpm dev:api`
- `pnpm lint`
- `pnpm type-check`

## Attendu pour chaque session

- Reprendre la prochaine tache la plus claire dans `TASK_BOARD.md`
- Verifier le dernier handoff
- Laisser le depot dans un etat transmissible
