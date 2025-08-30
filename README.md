# 🌱 Silococene Blessing
A gentle mental-health themed chatbot for the "Silococene" era — helping people talk through anxiety about technology, manipulation, and rapid change.

## Live stack
- Frontend: React (Vite)
- Backend: Netlify Functions
- LLM: Hugging Face Inference API (free key)

## Safety
- This bot is **not medical advice**. If you’re in immediate danger or thinking about self-harm, please contact local emergency services or a crisis hotline in your country right now.
- The backend has a simple crisis keyword check that returns crisis guidance instead of AI output.

## Quick deploy (GitHub + Netlify)
1. Create a Hugging Face token: https://huggingface.co/settings/tokens
2. Fork/clone this repo (or upload files as-is).
3. In Netlify → **Add new site** → **Import from Git** → select this repo.
4. Set:
   - Build command: `npm --prefix frontend ci && npm --prefix frontend run build`
   - Publish directory: `frontend/dist`
5. Add environment variables (Site settings → Environment variables):
   - `HF_API_KEY` = your Hugging Face token
   - *(optional)* `HF_MODEL` = e.g. `HuggingFaceH4/zephyr-7b-beta`
6. Deploy. Your site URL will appear after the build completes.

## Local dev (optional)
```bash
cd frontend
npm i
npm run dev
