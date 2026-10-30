import type { Provider } from "@/lib/types";

type Props = {
  provider: Provider;
  selected: boolean;
  onSelect: (provider: Provider) => void;
};

export function ProviderCard({ provider, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(provider)}
      className={`fade-up w-full rounded-2xl border p-5 text-left transition duration-200 ${
        selected
          ? "border-teal-600 bg-teal-50 shadow-md shadow-teal-900/10"
          : "border-[#d7e5e2] bg-white hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-900/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{provider.name}</h3>
          <p className="mt-1 text-sm font-medium text-teal-700">{provider.specialty}</p>
        </div>
        <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800">
          {provider.experience_years} yrs
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">{provider.location}</p>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{provider.bio}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {provider.available_slots.slice(0, 3).map((slot) => (
          <span
            key={slot}
            className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
          >
            {slot}
          </span>
        ))}
        {provider.available_slots.length > 3 ? (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
            +{provider.available_slots.length - 3}
          </span>
        ) : null}
      </div>
    </button>
  );
}
