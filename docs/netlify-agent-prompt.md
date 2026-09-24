# Netlify Agent deployment instructions

Use the connected GitHub repository `uiecs/instagram-ai-control-center` and deploy the `main` branch.

## Required build configuration

- Base directory: `web`
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `20`
- Environment variable: `NPM_FLAGS=--include=dev`
- Public frontend variable: `NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-DOMAIN.example.com`

Read `netlify.toml` as the source of truth. Do not move the base directory to the repository root and do not add a second build command. Install dependencies inside `web`, run `npm run build`, and fix any TypeScript, import, React Server Component, or Next.js error rather than suppressing it. Deploy only after the command exits with code 0. Then report the production URL and commit SHA.

Never put OpenAI, Meta, Brave, database, or Instagram credentials in frontend code or Netlify client variables. Those secrets belong only in the separate FastAPI backend deployment. The UI is intentionally English, uses a large readable font, and includes an Instagram icon in the top-left brand area.
