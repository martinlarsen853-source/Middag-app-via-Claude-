# Middag App - Development Guidelines

## Deployment
- **Production URL:** https://middag-app-via-claude.vercel.app
- **Vercel deploys from the `gh-pages` branch**
- ALL changes MUST be pushed to `gh-pages` to appear on the live site

## Git Workflow
- Always push final changes to `gh-pages`: `git push origin gh-pages`
- If working on a feature branch, merge/push to `gh-pages` when done
- The `gh-pages` branch contains full source code (not pre-built files)

## Project Structure
- `frontend/` - React (Vite) frontend
- `api/` - Vercel serverless API functions
- `supabase/` - Database migrations
- `vercel.json` - Vercel build config (builds frontend from source)

## Build
- Vercel runs: `cd frontend && npm install && npm run build`
- Output directory: `frontend/dist`
- API routes are served from `api/index.js`
