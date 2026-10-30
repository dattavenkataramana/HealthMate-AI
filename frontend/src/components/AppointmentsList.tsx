import type { Appointment } from "@/lib/types";

type Props = {
  appointments: Appointment[];
  loading: boolean;
};

export function AppointmentsList({ appointments, loading }: Props) {
  if (loading) {
    return <p className="text-sm text-slate-500">Loading appointments...</p>;
  }

  if (!appointments.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d7e5e2] bg-white/70 p-8 text-center">
        <p className="text-sm text-slate-500">
          No appointments yet. Book a sample visit to see it here with an AI summary.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((item) => (
        <article
          key={item.id}
          className="fade-up rounded-2xl border border-[#d7e5e2] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.provider_name}</h3>
              <p className="mt-1 text-sm text-teal-700">{item.specialty}</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-right text-sm text-slate-700">
              <div>{item.appointment_date}</div>
              <div className="font-semibold">{item.appointment_time}</div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Patient: <strong>{item.patient_name}</strong> · {item.patient_email}
          </p>
          <p className="mt-2 text-sm text-slate-600">Reason: {item.reason}</p>

          {item.summary ? (
            <div className="mt-4 rounded-xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">
              <p className="mb-1 font-semibold text-teal-800">AI appointment summary</p>
              <p className="whitespace-pre-wrap">{item.summary}</p>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
