---
title: PluginBase Docs Index
type: index
status: active
updated: 2026-04-20
---

# PluginBase — Centre de pilotage

Ce dossier `docs/` sert de base Obsidian pour piloter l’avancement produit et technique de PluginBase.

## Notes centrales

- [[dashboard]]
- [[roadmap]]

## Chantiers prioritaires

- [[chantiers/01-brancher-inventaire-sur-api]]
- [[chantiers/02-finaliser-parcours-scan-et-aha-moment]]
- [[chantiers/03-aligner-promesse-produit-et-architecture]]
- [[chantiers/04-fiabiliser-fiches-plugin-et-ia]]
- [[chantiers/05-securiser-auth-et-qualite-minimale]]

## Ce qui est confirmé dans le repo

- Monorepo avec `apps/web` (Next.js App Router), `apps/api` (Fastify + Prisma) et `packages/types`. Source : `README.md`, `package.json`, `apps/web/package.json`, `apps/api/package.json`.
- Landing publique déjà présente dans `apps/web/app/page.tsx`.
- API déjà structurée autour de `auth`, `plugins`, `scanner`, `views`, `admin`, `master`, `guides` dans `apps/api/src/index.ts`.
- Persistance métier côté BDD déjà modélisée dans `apps/api/prisma/schema.prisma`.
- Une partie du front inventaire repose encore sur un store Zustand local (`apps/web/stores/inventory-store.ts`) et des composants qui écrivent dans ce store (`FavoriteButton`, `StatusPicker`).

## Incertitudes à garder visibles

- Je n’ai pas pu lister toute l’arborescence du repo depuis l’environnement courant. Certains écrans existent probablement mais n’ont pas été confirmés chemin par chemin.
- Les routes/pages exactes du flux de scan et de la fiche plugin côté web n’ont pas toutes été retrouvées pendant l’audit.
- La présence éventuelle de tests existants n’a pas été confirmée.

## Règle de pilotage

Ne pas planifier de chantier qui dépend d’un écran ou d’un fichier non confirmé sans le marquer explicitement comme `à confirmer dans le repo`.
