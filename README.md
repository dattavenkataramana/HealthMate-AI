# HealthMate AI

AI Healthcare Appointment Assistant built for the **AI Growth & Automation Associate** assessment.

## What it does

- Search sample healthcare providers by specialty, location, and keyword
- Book demo appointments with date/time validation and duplicate-slot prevention
- Chat with an AI assistant for booking help and general health education
- Generate AI appointment summaries after booking
- Persist appointments in SQLite

> Educational demo only. Does **not** diagnose conditions, prescribe medication, or replace a clinician.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| AI | OpenAI API |
| Database | SQLite |
| Version control | Git + GitHub |

## Project structure

```text
healthmate-ai/
├── frontend/                 # Next.js app
├── backend/                  # FastAPI API
│   ├── data/providers.json
│   ├── assistant.py
│   ├── database.py
│   ├── main.py
│   └── models.py
├── documentation/
│   └── prompt-documentation.md
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.11+
- OpenAI API key (optional for booking/provider features; required for full AI replies)

## Setup

### 1. Backend

```powershell
cd backend
py -3 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Edit `backend/.env` and set your real key:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Start API:

```powershell
uvicorn main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend

Open a second terminal:

```powershell
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

App: [http://localhost:3010](http://localhost:3010)

> If port 3000 is already used by another project on your machine, this app is configured to run on **3010**.

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/providers` | List/filter sample providers |
| GET | `/api/providers/{id}` | Provider details |
| GET | `/api/appointments` | List booked appointments |
| POST | `/api/appointments` | Book appointment + AI summary |
| POST | `/api/assistant` | AI chat |
| POST | `/api/summary` | Generate appointment summary |

## Assessment submission package

1. **Project link** — this GitHub repository / live demo
2. **Prompt documentation** — `documentation/prompt-documentation.md`
3. **Video presentation** — record a 2+ minute walkthrough of the running app

Email submission to: `jobs@gokulinfocare.com`

## Prompt engineering highlights

- System prompt blocks diagnosis, prescriptions, invented providers, and emergency handling mistakes
- Booking summary prompt forces short, structured, non-clinical output
- Fallback replies work when OpenAI key is missing so the demo still functions

## Safety notes

- Sample providers and slots only
- No real patient medical records
- Always shows educational disclaimer
- Never commit `.env` files or API keys
