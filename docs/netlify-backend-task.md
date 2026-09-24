# Netlify Agent task: fix backend connection and deploy

The frontend is already updated with separate AI Chat and Command Console views. Do not merely redeploy the frontend with an empty API URL. Perform this task:

1. Inspect the repository `uiecs/instagram-ai-control-center` and deploy the `api/` FastAPI service separately to a public HTTPS host that supports Python (Render, Railway, Fly.io, or another connected backend host). Netlify is for the Next.js frontend only.
2. Configure backend secrets only on that backend host: `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_IMAGE_MODEL`, `META_ACCESS_TOKEN`, `META_IG_USER_ID`, `BRAVE_SEARCH_API_KEY` as needed. Never commit secrets.
3. Set backend `CORS_ORIGINS` to the final Netlify site URL. Do not use `*` in production.
4. Verify these backend endpoints using the public HTTPS backend URL:
   - GET `/health` returns HTTP 200
   - POST `/ai/chat` returns JSON with `text`
   - POST `/ai/content` returns JSON
   - POST `/ai/image` returns an image URL or data URL
   - POST `/search/username` returns public indexed results and clearly says exhaustive discovery is not guaranteed
5. In Netlify site environment variables, set exactly:
   `NEXT_PUBLIC_API_URL=https://THE-ACTUAL-BACKEND-DOMAIN`
   Do not use `localhost`, `127.0.0.1`, a placeholder, or an empty value.
6. Trigger a clean production deploy after saving the variable. Clear cache if needed.
7. If any endpoint fails, inspect the backend logs and fix the backend; do not change the UI to hide the error.
8. Do not claim success until `/health` and `/ai/chat` have been tested from the deployed frontend origin.
9. Report the actual frontend URL, actual backend URL, HTTP status of each health check, and commit SHA.

Important: the frontend cannot open this ChatGPT conversation directly. AI Chat must use the configured backend OpenAI-compatible provider. Do not expose private keys in browser code. Do not enable unofficial Instagram follow/unfollow automation.
