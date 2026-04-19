# Collaboration multi-agents

Cet espace sert de mémoire partagée opérationnelle entre Codex et Claude Code dans Cursor.

`AGENTS.md` reste la source de vérité centrale pour :
- la vision produit
- le stack technique
- le design system
- l'architecture cible
- les décisions durables

Les fichiers de ce dossier servent a faire vivre le travail au quotidien sans perdre le contexte entre deux agents.

## Ordre de lecture au debut d'une session

1. `AGENTS.md`
2. `docs/collaboration/WORKING_RULES.md`
3. `docs/collaboration/PROJECT_CONTEXT.md`
4. `docs/collaboration/TASK_BOARD.md`
5. la derniere entree de `docs/collaboration/HANDOFF_LOG.md`

## Role de chaque fichier

- `WORKING_RULES.md` : regles permanentes de collaboration et d'hygiene de travail.
- `PROJECT_CONTEXT.md` : resume vivant du projet, de son etat reel et des zones sensibles.
- `TASK_BOARD.md` : suivi des taches, priorites, statut, proprietaire courant.
- `HANDOFF_LOG.md` : journal append-only de passation entre agents.
- `HANDOFF_TEMPLATE.md` : format impose pour toute passation.
- `DECISIONS.md` : index operationnel des decisions, avec source canonique dans `AGENTS.md`.

## Regles de maintenance

- Ne pas dupliquer la vision produit ou l'architecture en dehors de `AGENTS.md`.
- Toute decision durable doit etre ajoutee dans `AGENTS.md` section `DÉCISIONS`.
- Toute passation doit mettre a jour a la fois `TASK_BOARD.md` et `HANDOFF_LOG.md`.
- Si un document de ce dossier devient faux, le corriger dans la meme session que le changement de code.
