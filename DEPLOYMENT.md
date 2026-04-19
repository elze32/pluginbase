# Déploiement de PluginBase sur Vercel

Ce guide explique comment déployer l'application web PluginBase sur Vercel.

## Prérequis

- Un compte [Vercel](https://vercel.com).
- Node.js 18 ou plus récent.
- pnpm installé localement (`npm install -g pnpm`).

## Étapes de déploiement

1. **Connecter le repository** :
   - Sur Vercel, cliquez sur "Add New" > "Project".
   - Importez le repository `pluginbase`.

2. **Configurer le projet** :
   - **Framework Preset** : Next.js.
   - **Root Directory** : `apps/web`.
   - **Build Command** : `cd ../.. && pnpm install --frozen-lockfile && pnpm --filter web build`
   - **Install Command** : (laisser vide, c'est géré par la commande de build).
   - **Output Directory** : `.next`.

3. **Variables d'environnement** :
   - Pour l'instant, aucune variable n'est critique pour le fonctionnement (le backend n'est pas encore relié).
   - Vous pouvez toutefois ajouter `NEXT_PUBLIC_APP_URL` avec l'URL finale fournie par Vercel.

4. **Headers et Région** :
   - Le fichier `vercel.json` est déjà configuré pour utiliser la région `cdg1` (Paris) et appliquer des headers de sécurité stricts.

## Après le déploiement

### Tests de fonctionnement

1. **Vérification du Scanner** :
   - Ouvrez l'URL de production dans **Google Chrome** ou un navigateur basé sur Chromium (Edge, Brave).
   - Le scanner nécessite **HTTPS** pour fonctionner (Vercel le fournit par défaut).
   - Cliquez sur "Scanner ma collection" et vérifiez que le sélecteur de dossier s'ouvre.

2. **Vérification de la Persistance** :
   - Scannez quelques plugins, changez leur statut ou marquez-les en favoris.
   - Rechargez la page. Les données doivent être conservées (sauvegarde dans le localStorage du navigateur).

3. **Vérification SEO** :
   - Vérifiez que l'image OpenGraph dynamique fonctionne en collant l'URL sur [opengraph.xyz](https://www.opengraph.xyz).
   - L'image doit afficher les compteurs de plugins et le logo.

## Limitations connues

- **Navigateurs** : Le scanner ne fonctionne pas sur Firefox et Safari (limitation de l'API File System Access). Un message d'explication s'affiche automatiquement pour ces utilisateurs.
- **Dossiers système** : Sur Windows, Chrome peut bloquer l'accès direct à `C:\Program Files\Common Files\VST3`. L'utilisateur doit copier ses dossiers de plugins dans un dossier utilisateur (ex: Bureau) pour le test, ou utiliser le futur binaire Rust.
