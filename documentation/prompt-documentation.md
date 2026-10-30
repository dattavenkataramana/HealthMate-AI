# HealthMate AI — Prompt Engineering Documentation

## 1. Project Overview

**Project Name:** HealthMate AI  
**Domain:** Healthcare Technology  
**Project Type:** AI-powered healthcare appointment assistant  
**Objective:** Build a working web application that helps users explore sample healthcare providers, book sample appointments, and interact with an AI assistant for general healthcare education and appointment support.

**Stack:** Next.js + Python FastAPI + OpenAI API + SQLite

## 2. AI Tools Used

| Tool | Why selected | Tasks supported |
| --- | --- | --- |
| ChatGPT / Cursor AI | Fast architecture planning and iterative code generation | Project structure, frontend/backend scaffolding, debugging |
| OpenAI API (`gpt-4o-mini`) | Production-style assistant responses inside the app | Appointment chat + appointment summaries |

Evaluation approach:

- Checked whether responses avoided diagnosis/prescription language
- Verified booking summaries used only provided appointment fields
- Confirmed fallback mode worked without an API key

## 3. Initial Prompt — Project Planning

```text
I am completing an AI Skills and Prompt Engineering assessment for an AI Growth & Automation Associate position.

Build a project called HealthMate AI, an AI Healthcare Appointment Assistant.

Technology stack:
- Next.js (frontend)
- Python FastAPI (backend)
- SQLite (appointments)
- OpenAI API (assistant)

Features:
- Search sample healthcare providers by specialty/location
- Book sample appointments with validation
- Prevent duplicate appointment slots
- AI assistant for general health education and appointment help
- AI-generated appointment summaries
- Appointment dashboard

Provide architecture, folder structure, API endpoints, database schema, and development steps.
Keep the application educational and do not provide medical diagnosis functionality.
```

**Result:** Defined monorepo layout (`frontend/`, `backend/`, `documentation/`), API contracts, and safety constraints before coding.

## 4. Frontend Development Prompt

```text
Build a responsive Next.js App Router frontend for HealthMate AI.

Create:
- Provider search with specialty/location filters
- Provider cards
- Appointment booking form
- AI assistant chat interface
- Appointments dashboard with AI summary display

Requirements:
- TypeScript
- Tailwind CSS
- Loading and error states
- Functional buttons and forms
- Clean healthcare-focused UI
- Educational medical disclaimer
```

**Revision:** Added explicit instruction to keep filter option lists independent from filtered results so specialty/location dropdowns do not shrink after filtering.

## 5. Backend Development Prompt

```text
Create a FastAPI backend for HealthMate AI.

Implement:
- GET /api/providers (with specialty, location, q filters)
- GET /api/providers/{id}
- POST /api/appointments
- GET /api/appointments
- POST /api/assistant
- POST /api/summary

Use SQLite for appointments and JSON for sample providers.
Validate request data, block duplicate slots, keep API keys in .env, and enable CORS for localhost:3000.
Do not implement real patient clinical records or diagnosis endpoints.
```

**Result:** Implemented validated booking flow with unique slot index and OpenAI-backed summary generation.

## 6. AI Assistant System Prompt (used in production code)

```text
You are HealthMate AI, a healthcare appointment support assistant.

Your responsibilities:
- Help users understand the appointment booking process in this demo application.
- Answer general health education questions using cautious, understandable language.
- Help users prepare questions for a qualified healthcare professional.
- Summarize appointment information supplied by the user or the application.
- Ask clarifying questions when appointment information is incomplete.

Safety requirements:
- Do not diagnose medical conditions.
- Do not prescribe medication or dosages.
- Do not claim to replace a doctor or emergency services.
- Do not invent healthcare providers, appointment availability, or medical facts.
- If the user describes an emergency, advise them to contact local emergency services immediately.
- Do not request unnecessary sensitive personal information such as government IDs or bank details.
- Keep responses clear, concise, and helpful.
- Always remind users that this is educational information only.
```

## 7. Prompt Refinement Log

### Revision A — Safety tightening

**Problem identified:** Early assistant drafts risked sounding diagnostic.  
**Improved instruction:** Explicit bans on diagnosis, prescriptions, invented providers, and emergency handling.  
**Result:** Responses stayed educational and redirected users toward qualified care when needed.

### Revision B — Appointment summary control

**Initial prompt:** “Summarize this appointment.”  
**Problem identified:** Output could become verbose and invent clinical advice.  
**Improved prompt:**

```text
Create a short appointment summary for a healthcare booking demo.
Rules:
- 3 to 5 short sentences
- Confirm the booked details clearly
- Suggest 2 useful questions the patient can ask the doctor
- Do not diagnose or prescribe anything
- End with a reminder that this is educational demo information only
```

**Result:** Consistent short summaries tied only to booked fields.

### Revision C — Offline / missing key fallback

**Problem identified:** Demo failed completely without OpenAI credentials.  
**Improved approach:** Added deterministic fallback replies for booking help and emergencies when `OPENAI_API_KEY` is missing.  
**Result:** Provider search and booking still work; assistant remains useful for assessment demos.

## 8. Challenges and Solutions

| Challenge | Solution |
| --- | --- |
| OpenAI key may be unavailable during local testing | Fallback reply mode with `source: fallback` |
| Duplicate booking attempts | Unique SQLite index on provider + date + time |
| Frontend/backend CORS issues | Explicit CORS origins via env |
| Filter dropdowns emptying after search | Keep `allProviders` separate from filtered list |
| Medical safety risk | Strong system prompt + UI disclaimer |

## 9. Final Outcome

**Features delivered:**

- Provider search and filtering
- Appointment booking with validation
- Duplicate slot prevention
- AI chat assistant
- AI appointment summary
- Appointments dashboard
- Prompt documentation for assessment review

**How to run:** see root `README.md`.

## 10. Conclusion

This project demonstrates practical AI-assisted development:

1. Plan architecture with prompts
2. Generate and refine frontend/backend code
3. Engineer a constrained assistant prompt
4. Iterate when outputs are unsafe or inconsistent
5. Ship a working, testable application with documentation

Prompt engineering was treated as product logic, not just text generation: safety rules, output format, and fallback behavior were designed deliberately.
