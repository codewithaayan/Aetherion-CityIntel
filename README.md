# Aetherion CityIntel

Aetherion CityIntel contains a Next.js frontend and FastAPI backend. The frontend reads the existing backend routes and does not substitute demonstration values when data or owner adapters are unavailable.

## Local setup

1. Install Python 3.12+ and Node.js 20.9+.
2. Copy `.env.example` to `.env` and supply `DATABASE_URL` when the team database is available.
3. Install and start the backend:

```powershell
python -m pip install -r requirements-dev.txt
python -m uvicorn backend.main:app --reload --port 8000
```

4. In another terminal, install and start the frontend:

```powershell
npm ci
npm run dev
```

Open `http://localhost:3000`. The frontend uses `NEXT_PUBLIC_API_BASE_URL`, which defaults to `http://127.0.0.1:8000`. A missing database or team adapter is shown as an unavailable state.

## Checks

```powershell
python -m pytest
npm run lint
npm run build
```

See [frontend integration](docs/frontend-integration.md), [backend contract](docs/backend-contract.md), and [teammate handoff](docs/teammate-handoff.md).
