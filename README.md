# Dropship Ad Lab

Full-stack MVP for analyzing dropshipping product ideas and generating TikTok ad concepts with OpenAI.

## Stack

- Backend: FastAPI, Pydantic, OpenAI API, python-dotenv, CORS
- Frontend: Vite, React, TypeScript, Tailwind CSS
- Deployment: Render backend, Vercel frontend

## Local Setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` and set `OPENAI_API_KEY`.

Run the API:

```bash
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs at `http://localhost:5173`.

For local development, `frontend/.env` should contain:

```env
VITE_API_URL=http://localhost:8000
```

## API

### `GET /health`

Returns API health status.

### `POST /api/analyze`

Request body:

```json
{
  "product_name": "Portable blender",
  "niche": "Fitness",
  "product_cost": 12.5,
  "selling_price": 34.99,
  "target_customer": "Busy gym-goers and students"
}
```

Response body:

```json
{
  "trend_angle": "string",
  "target_audience": "string",
  "competition_level": "string",
  "margin_analysis": "string",
  "tiktok_hooks": ["string"],
  "tiktok_ad_scripts": ["string"],
  "captions": ["string"],
  "offer_ideas": ["string"],
  "risk_warnings": ["string"]
}
```

## Deploy Backend To Render

1. Push this repo to GitHub.
2. Create a new Render Web Service using the `backend/render.yaml` blueprint or configure manually:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add environment variables in Render:
   - `OPENAI_API_KEY`
   - `FRONTEND_ORIGIN` with your Vercel URL, for example `https://your-app.vercel.app`

## Deploy Frontend To Vercel

1. Import the repo into Vercel.
2. Set the root directory to `frontend`.
3. Add environment variable:
   - `VITE_API_URL` with your Render backend URL, for example `https://dropship-ad-lab-api.onrender.com`
4. Deploy.

## Notes

This MVP intentionally does not include authentication, a database, Stripe, scraping, or Shopify integration.
