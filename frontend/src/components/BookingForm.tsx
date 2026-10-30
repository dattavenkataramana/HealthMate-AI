"use client";

import { FormEvent, useMemo, useState } from "react";
import { bookAppointment } from "@/lib/api";
import type { Appointment, Provider } from "@/lib/types";

type Props = {
  provider: Provider | null;
  onBooked: (appointment: Appointment) => void;
};

export function BookingForm({ provider, onBooked }: Props) {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!provider) {
      setError("Please select a healthcare provider first.");
      return;
    }

    setLoading(true);
    try {
      const appointment = await bookAppointment({
        provider_id: provider.id,
        patient_name: patientName,
        patient_email: patientEmail,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        reason,
      });
      onBooked(appointment);
      setSuccess("Appointment booked successfully.");
      setPatientName("");
      setPatientEmail("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to book appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-4 text-sm text-teal-900">
        {provider ? (
          <>
            Booking with <strong>{provider.name}</strong> · {provider.specialty}
          </>
        ) : (
          "Select a provider from the list to continue booking."
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Full name</span>
          <input
            required
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 outline-none ring-teal-500 focus:ring-2"
            placeholder="Your name"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Email</span>
          <input
            required
            type="email"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
            className="w-full rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 outline-none ring-teal-500 focus:ring-2"
            placeholder="you@example.com"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Date</span>
          <input
            required
            type="date"
            min={minDate}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 outline-none ring-teal-500 focus:ring-2"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Time slot</span>
          <select
            required
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            disabled={!provider}
            className="w-full rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 outline-none ring-teal-500 focus:ring-2 disabled:opacity-60"
          >
            <option value="">Select a slot</option>
            {provider?.available_slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-slate-700">Reason for visit</span>
        <textarea
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 outline-none ring-teal-500 focus:ring-2"
          placeholder="Brief reason for the appointment"
        />
      </label>

      {error ? (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !provider}
        className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Booking..." : "Book appointment"}
      </button>
    </form>
  );
}
