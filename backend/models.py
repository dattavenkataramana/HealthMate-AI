"""Pydantic request/response models."""

from __future__ import annotations

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    source: str = "openai"


class AppointmentCreate(BaseModel):
    provider_id: int
    patient_name: str = Field(..., min_length=2, max_length=100)
    patient_email: str = Field(..., min_length=5, max_length=120)
    appointment_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    appointment_time: str = Field(..., pattern=r"^\d{2}:\d{2}$")
    reason: str = Field(..., min_length=3, max_length=500)


class AppointmentResponse(BaseModel):
    id: int
    provider_id: int
    provider_name: str
    specialty: str
    patient_name: str
    patient_email: str
    appointment_date: str
    appointment_time: str
    reason: str
    summary: str | None = None
    created_at: str


class SummaryRequest(BaseModel):
    provider_name: str
    specialty: str
    appointment_date: str
    appointment_time: str
    reason: str
    patient_name: str


class SummaryResponse(BaseModel):
    summary: str
