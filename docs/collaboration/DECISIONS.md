# Historique de decisions

## Canonical

La source de verite pour les decisions durables reste la section `DÉCISIONS` de `AGENTS.md`.

Ce fichier sert d'index rapide pour aider un agent a comprendre les choix deja actes sans reparcourir tout le document.

## Decisions actives

| Date | Decision | Source |
|------|----------|--------|
| 2026-04 | Fond clair plutot que dark | `AGENTS.md` |
| 2026-04 | Fastify plutot que Express | `AGENTS.md` |
| 2026-04 | Scanner en Rust | `AGENTS.md` |
| 2026-04 | Pas de marketplace en v1 | `AGENTS.md` |
| 2026-04-15 | Collaboration multi-agents pilotee par `AGENTS.md` et `docs/collaboration/` | `AGENTS.md` |
| 2026-04-15 | `ROLES.md` sert de repere leger de specialisation entre agents | `AGENTS.md` |
| 2026-04-15 | Les fiches guides utilisent des images locales servies depuis `apps/web/public/plugins/`, avec capture de page officielle en fallback si le hotlink fabricant bloque | `AGENTS.md` |

## Regle de mise a jour

Quand une decision durable est prise :
1. mettre a jour `AGENTS.md`
2. mettre a jour cet index si la decision aide a la reprise rapide
