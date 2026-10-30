"""OpenAI assistant helpers with safe fallback replies."""

from __future__ import annotations

import os
from typing import Any

from openai import OpenAI

SYSTEM_PROMPT = """
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
""".strip()


def get_client() -> OpenAI | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or api_key.startswith("your_"):
        return None
    return OpenAI(api_key=api_key)


def get_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def fallback_reply(message: str) -> str:
    lower = message.lower()
    if any(word in lower for word in ("emergency", "chest pain", "unconscious", "bleeding")):
        return (
            "If this is a medical emergency, contact local emergency services immediately. "
            "HealthMate AI cannot provide emergency care or diagnosis."
        )
    if "book" in lower or "appointment" in lower:
        return (
            "To book a sample appointment: choose a provider, pick an available date and time, "
            "enter your name and email, add a short reason for the visit, then confirm booking. "
            "This demo stores sample appointments only and does not connect to a real clinic."
        )
    if "summary" in lower:
        return (
            "After booking, HealthMate AI can generate a short appointment summary using the "
            "provider, date, time, and reason you entered. No diagnosis is included."
        )
    return (
        "I can help with appointment booking steps and general health education. "
        "I cannot diagnose conditions or replace a qualified clinician. "
        "Add your OpenAI API key in backend/.env to enable full AI responses."
    )


def ask_assistant(message: str) -> dict[str, str]:
    client = get_client()
    if client is None:
        return {"reply": fallback_reply(message), "source": "fallback"}

    response = client.chat.completions.create(
        model=get_model(),
        temperature=0.4,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ],
    )
    reply = response.choices[0].message.content or fallback_reply(message)
    return {"reply": reply.strip(), "source": "openai"}


def generate_appointment_summary(details: dict[str, Any]) -> str:
    prompt = f"""
Create a short appointment summary for a healthcare booking demo.

Provider: {details['provider_name']}
Specialty: {details['specialty']}
Patient: {details['patient_name']}
Date: {details['appointment_date']}
Time: {details['appointment_time']}
Reason: {details['reason']}

Rules:
- 3 to 5 short sentences
- Confirm the booked details clearly
- Suggest 2 useful questions the patient can ask the doctor
- Do not diagnose or prescribe anything
- End with a reminder that this is educational demo information only
""".strip()

    client = get_client()
    if client is None:
        return (
            f"Appointment booked with {details['provider_name']} ({details['specialty']}) "
            f"on {details['appointment_date']} at {details['appointment_time']} "
            f"for {details['patient_name']}. Reason noted: {details['reason']}. "
            "Suggested questions: What symptoms should I monitor? What follow-up steps do you recommend? "
            "Educational demo information only - not medical advice."
        )

    response = client.chat.completions.create(
        model=get_model(),
        temperature=0.3,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )
    return (response.choices[0].message.content or "").strip()
