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
