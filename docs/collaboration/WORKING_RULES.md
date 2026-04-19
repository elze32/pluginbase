# Regles permanentes

## Objectif

Permettre a deux agents de travailler sur le meme depot sans perdre de temps, sans se contredire et sans casser les conventions du projet.

## Regles communes

- Lire `AGENTS.md` avant toute tache non triviale.
- Considerer `AGENTS.md` comme la reference prioritaire en cas de doute.
- Travailler en francais pour tout contenu produit dans le projet, sauf contrainte technique explicite.
- Respecter strictement le stack impose dans `AGENTS.md`.
- Ne pas introduire de variante de style, de librairie ou d'architecture sans l'ecrire dans `AGENTS.md` si le changement est durable.

## Regles de coordination

- Verifier `TASK_BOARD.md` avant de commencer.
- Si une tache est deja `En cours`, ne pas intervenir dessus sans raison explicite.
- Si une tache est reprise, mentionner l'agent precedent dans le handoff de sortie.
- Toujours laisser un prochain pas concret et immediatement executable.

## Regles de documentation

- `AGENTS.md` contient les decisions stables.
- `PROJECT_CONTEXT.md` contient l'etat reel du depot et les points d'attention.
- `HANDOFF_LOG.md` raconte les transitions de session.
- `TASK_BOARD.md` donne la photo de l'avancement a l'instant T.
- `DECISIONS.md` est un index de lecture rapide, pas une source de verite concurrente.

## Definition d'un handoff propre

Un handoff est considere propre seulement si :
- le travail effectif est decrit honnetement
- les fichiers modifies sont listes
- les tests lances ou non lances sont precises
- les blocages sont nommes explicitement
- le prochain agent peut agir sans devoir reconstituer l'historique

## Routine de fin de session (DX-001)

Avant de quitter une session, l'agent DOIT :
1. **Validation technique** : Lancer un `pnpm lint` et un `pnpm type-check` (ou les commandes équivalentes du workspace).
2. **Mise à jour board** : Passer les tâches complétées en `Fait` dans `TASK_BOARD.md` et définir le "Prochain pas".
3. **Journal de passation** : Créer une entrée dans `HANDOFF_LOG.md` (utiliser `HANDOFF_TEMPLATE.md`).
4. **Clean-up** : Fermer tous les terminaux de background et supprimer les fichiers temporaires de scratchpad éventuels.
