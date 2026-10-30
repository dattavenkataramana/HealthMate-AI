export type Provider = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  experience_years: number;
  languages: string[];
  available_slots: string[];
  bio: string;
};

export type Appointment = {
  id: number;
  provider_id: number;
  provider_name: string;
  specialty: string;
  patient_name: string;
  patient_email: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  summary: string | null;
  created_at: string;
};

export type ChatResponse = {
  reply: string;
  source: string;
};
