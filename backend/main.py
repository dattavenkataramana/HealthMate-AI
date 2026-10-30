"""HealthMate AI — FastAPI backend."""

from __future__ import annotations

import json
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from assistant import ask_assistant, generate_appointment_summary
from database import create_appointment, init_db, list_appointments, slot_taken
from models import (
    AppointmentCreate,
    AppointmentResponse,
    ChatRequest,
    ChatResponse,
    SummaryRequest,
    SummaryResponse,
)

load_dotenv()

PROVIDERS_PATH = Path(__file__).resolve().parent / "data" / "providers.json"

app = FastAPI(
    title="HealthMate AI API",
    description="AI Healthcare Appointment Assistant",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3010,http://127.0.0.1:3010,https://health-mate-ai-beige.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_providers() -> list[dict]:
    with PROVIDERS_PATH.open(encoding="utf-8") as handle:
        return json.load(handle)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


@app.get("/")
def home() -> dict:
    return {
        "message": "HealthMate AI API is running",
        "docs": "/docs",
        "endpoints": [
            "/api/providers",
            "/api/appointments",
            "/api/assistant",
            "/api/summary",
        ],
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/providers")
def get_providers(
    specialty: str | None = Query(default=None),
    location: str | None = Query(default=None),
    q: str | None = Query(default=None),
) -> list[dict]:
    providers = load_providers()

    if specialty:
        providers = [
            item
            for item in providers
            if specialty.lower() in item["specialty"].lower()
        ]
    if location:
        providers = [
            item
            for item in providers
            if location.lower() in item["location"].lower()
        ]
    if q:
        query = q.lower()
        providers = [
            item
            for item in providers
            if query in item["name"].lower()
            or query in item["specialty"].lower()
            or query in item["location"].lower()
        ]

    return providers


@app.get("/api/providers/{provider_id}")
def get_provider(provider_id: int) -> dict:
    for provider in load_providers():
        if provider["id"] == provider_id:
            return provider
    raise HTTPException(status_code=404, detail="Provider not found")


@app.get("/api/appointments", response_model=list[AppointmentResponse])
def get_appointments() -> list[dict]:
    return list_appointments()


@app.post("/api/appointments", response_model=AppointmentResponse)
def book_appointment(payload: AppointmentCreate) -> dict:
    provider = next(
        (item for item in load_providers() if item["id"] == payload.provider_id),
        None,
    )
    if provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")

    if payload.appointment_time not in provider["available_slots"]:
        raise HTTPException(
            status_code=400,
            detail="Selected time is not in the provider's available sample slots",
        )

    if slot_taken(payload.provider_id, payload.appointment_date, payload.appointment_time):
        raise HTTPException(
            status_code=409,
            detail="This appointment slot is already booked",
        )

    summary = generate_appointment_summary(
        {
            "provider_name": provider["name"],
            "specialty": provider["specialty"],
            "patient_name": payload.patient_name,
            "appointment_date": payload.appointment_date,
            "appointment_time": payload.appointment_time,
            "reason": payload.reason,
        }
    )

    try:
        return create_appointment(
            {
                "provider_id": provider["id"],
                "provider_name": provider["name"],
                "specialty": provider["specialty"],
                "patient_name": payload.patient_name.strip(),
                "patient_email": payload.patient_email.strip().lower(),
                "appointment_date": payload.appointment_date,
                "appointment_time": payload.appointment_time,
                "reason": payload.reason.strip(),
                "summary": summary,
            }
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=409,
            detail="Unable to book appointment. Slot may already be taken.",
        ) from exc


@app.post("/api/assistant", response_model=ChatResponse)
def assistant_chat(payload: ChatRequest) -> dict:
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        return ask_assistant(message)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"AI assistant unavailable: {exc}",
        ) from exc


@app.post("/api/summary", response_model=SummaryResponse)
def appointment_summary(payload: SummaryRequest) -> dict:
    try:
        summary = generate_appointment_summary(payload.model_dump())
        return {"summary": summary}
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=502,
            detail=f"Unable to generate summary: {exc}",
        ) from exc

