import type { Appointment, ChatResponse, Provider } from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    let detail = "Request failed";
    try {
      const data = await response.json();
      detail = data.detail || detail;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail));
  }

  return response.json() as Promise<T>;
}

export function fetchProviders(params?: {
  specialty?: string;
  location?: string;
  q?: string;
}): Promise<Provider[]> {
  const query = new URLSearchParams();
  if (params?.specialty) query.set("specialty", params.specialty);
  if (params?.location) query.set("location", params.location);
  if (params?.q) query.set("q", params.q);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<Provider[]>(`/api/providers${suffix}`);
}

export function fetchAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/api/appointments");
}

export function bookAppointment(payload: {
  provider_id: number;
  patient_name: string;
  patient_email: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}): Promise<Appointment> {
  return request<Appointment>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function askAssistant(message: string): Promise<ChatResponse> {
  return request<ChatResponse>("/api/assistant", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export { API_URL };
