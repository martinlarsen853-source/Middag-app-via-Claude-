# Middag App - Development Guidelines

## Deployment
- **Production URL:** https://middag-app-via-claude.vercel.app
- **Vercel deploys from the `main` branch**
- ALL changes MUST be pushed to `main` to appear on the live site

## Git Workflow
- Always push final changes to `main`: `git push origin main`
- If working on a feature branch, merge/push to `main` when done

## Project Structure
- `frontend/` - React (Vite) frontend
- `api/` - Vercel serverless API functions
- `supabase/` - Database migrations
- `vercel.json` - Vercel build config (builds frontend from source)

## Build
- Vercel runs: `cd frontend && npm install && npm run build`
- Output directory: `frontend/dist`
- API routes are served from `api/index.js`

## Ingredient Sync (Kassalapp Integration)

### Daily Sync via Cron
Ingredienspriser synkroniseres daglig fra Kassalapp API. 

**HTTP Endpoint:**
```bash
POST https://middag-app-via-claude.vercel.app/api/sync-ingredients
```

**Sikkerhet:**
- Hvis `SYNC_API_KEY` er satt i .env, må request inkludere `X-Sync-Key` header eller `sync_key` i body
- Uten nøkkel: endepointen er åpen (ideelt for cron-tjenester)

**Eksempel cURL:**
```bash
curl -X POST https://middag-app-via-claude.vercel.app/api/sync-ingredients \
  -H "Content-Type: application/json"
```

**Med API-nøkkel:**
```bash
curl -X POST https://middag-app-via-claude.vercel.app/api/sync-ingredients \
  -H "X-Sync-Key: your-sync-key"
```

**Anbefalt setup:**
1. Sett `SYNC_API_KEY` miljøvariabel i Vercel
2. Bruk ekstern cron-tjeneste (cron-job.org, EasyCron, etc.)
3. Cron kaller endepointen med X-Sync-Key header hver dag

**Response:**
```json
{
  "ok": true,
  "synced": 150,
  "updated": 45,
  "errors": 2,
  "total_processed": 197,
  "duration_seconds": 23
}
```
