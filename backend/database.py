"""SQLite helpers for HealthMate AI appointments."""

from __future__ import annotations

import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parent / "healthmate.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                provider_id INTEGER NOT NULL,
                provider_name TEXT NOT NULL,
                specialty TEXT NOT NULL,
                patient_name TEXT NOT NULL,
                patient_email TEXT NOT NULL,
                appointment_date TEXT NOT NULL,
                appointment_time TEXT NOT NULL,
                reason TEXT NOT NULL,
                summary TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        conn.execute(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS ux_appointment_slot
            ON appointments (provider_id, appointment_date, appointment_time)
            """
        )
        conn.commit()


def list_appointments() -> list[dict[str, Any]]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, provider_id, provider_name, specialty, patient_name,
                   patient_email, appointment_date, appointment_time, reason,
                   summary, created_at
            FROM appointments
            ORDER BY appointment_date DESC, appointment_time DESC
            """
        ).fetchall()
        return [dict(row) for row in rows]


def slot_taken(provider_id: int, appointment_date: str, appointment_time: str) -> bool:
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT 1 FROM appointments
            WHERE provider_id = ? AND appointment_date = ? AND appointment_time = ?
            """,
            (provider_id, appointment_date, appointment_time),
        ).fetchone()
        return row is not None


def create_appointment(payload: dict[str, Any]) -> dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO appointments (
                provider_id, provider_name, specialty, patient_name,
                patient_email, appointment_date, appointment_time, reason, summary
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload["provider_id"],
                payload["provider_name"],
                payload["specialty"],
                payload["patient_name"],
                payload["patient_email"],
                payload["appointment_date"],
                payload["appointment_time"],
                payload["reason"],
                payload.get("summary"),
            ),
        )
        conn.commit()
        appointment_id = cursor.lastrowid

    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT id, provider_id, provider_name, specialty, patient_name,
                   patient_email, appointment_date, appointment_time, reason,
                   summary, created_at
            FROM appointments WHERE id = ?
            """,
            (appointment_id,),
        ).fetchone()
        return dict(row)
