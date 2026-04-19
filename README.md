# PluginBase

Assistant de lucidite pour reprendre le controle de sa collection de plugins audio.

## Prerequis

- Node.js 20+
- pnpm 10+
- PostgreSQL accessible localement ou via Supabase

## Demarrage rapide

### 1. Installer les dependances

```bash
pnpm install
```

### 2. Copier les fichiers d'environnement

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Sous PowerShell :

```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.local.example apps/web/.env.local
```

### 3. Renseigner la base PostgreSQL

Dans `apps/api/.env`, configure au minimum :

```env
DATABASE_URL="postgresql://user:password@host:5432/postgres"
JWT_SECRET="change-me"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

Note : l'API charge automatiquement `apps/api/.env` au demarrage.

### 4. Initialiser le schema Prisma

```bash
pnpm --filter api db:push
```

### 5. Lancer le projet

Depuis la racine :

```bash
pnpm dev
```

Ou separer les services :

```bash
pnpm dev:api
pnpm dev:web
```

### 6. Verifier que tout est OK

- Web : [http://localhost:3000](http://localhost:3000)
- API : [http://localhost:3001/health](http://localhost:3001/health)

## Commandes utiles

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

## Structure utile

```text
pluginbase/
|-- apps/
|   |-- web/      # Next.js App Router
|   `-- api/      # Fastify + Prisma
`-- packages/
    `-- types/    # Types partages
```
