# PaperTrail UI

Next.js UI for the PaperTrail API.

![admin dashboard](/1.png)

## Run locally

From the repo root:

```bash
npm --prefix ui install
npm --prefix ui run dev
```

Open `http://localhost:3000`.

## API base URL

The UI calls the API using this priority order:

1. `localStorage.papertrail.apiBaseUrl` (set via Settings)
2. `NEXT_PUBLIC_API_BASE_URL` (environment variable)
3. Default: `http://localhost:8080`

## JWT

Most admin pages require a JWT set in Settings (stored at `localStorage.papertrail.jwt`).

## Public pages

- `/public/papers` lists papers without a JWT (requires the API to expose `GET /api/papers`).
- `/public/papers/[id]` shows paper details without a JWT.

## Scripts

```bash
npm run dev
npm run build
npm run start
```
