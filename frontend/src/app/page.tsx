"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppointmentsList } from "@/components/AppointmentsList";
import { AssistantChat } from "@/components/AssistantChat";
import { BookingForm } from "@/components/BookingForm";
import { ProviderCard } from "@/components/ProviderCard";
import { fetchAppointments, fetchProviders } from "@/lib/api";
import type { Appointment, Provider } from "@/lib/types";

type Tab = "providers" | "book" | "assistant" | "appointments";

export default function Home() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [providerError, setProviderError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("providers");

  const loadProviders = useCallback(async () => {
    setLoadingProviders(true);
    setProviderError("");
    try {
      const data = await fetchProviders({
        specialty: specialty || undefined,
        location: location || undefined,
        q: query || undefined,
      });
      setProviders(data);
    } catch {
      setProviderError(
        "Unable to load providers. Check the API connection and try again."
      );
      setProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  }, [specialty, location, query]);

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    void fetchProviders()
      .then(setAllProviders)
      .catch(() => setAllProviders([]));
  }, []);

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const specialties = useMemo(
    () =>
      Array.from(new Set(allProviders.map((item) => item.specialty))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [allProviders]
  );

  const locations = useMemo(
    () =>
      Array.from(new Set(allProviders.map((item) => item.location))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [allProviders]
  );

  function handleSelectProvider(provider: Provider) {
    setSelectedProvider(provider);
    setActiveTab("book");
  }

  function handleBooked(appointment: Appointment) {
    setAppointments((prev) => [appointment, ...prev]);
    setActiveTab("appointments");
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "providers", label: "Find providers" },
    { id: "book", label: "Book visit" },
    { id: "assistant", label: "AI assistant" },
    { id: "appointments", label: "My appointments" },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="fade-up mb-8 overflow-hidden rounded-[28px] border border-teal-100 bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700 p-8 text-white shadow-xl shadow-teal-900/20 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal-100">
          HealthMate AI
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight md:text-5xl">
          Healthcare appointment assistant
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-teal-50 md:text-lg">
          Search sample providers, book a demo appointment, and chat with an AI
          assistant for booking help and general health education.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-teal-50">
          <span className="rounded-full bg-white/15 px-3 py-1.5">Next.js</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">FastAPI</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">OpenAI</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">SQLite</span>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-teal-700 text-white shadow-md shadow-teal-900/15"
                : "bg-white text-slate-600 ring-1 ring-[#d7e5e2] hover:text-teal-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "providers" ? (
        <section className="glass-panel fade-up rounded-[28px] p-6 md:p-8">
          <div className="mb-6 grid gap-3 md:grid-cols-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, specialty, city"
              className="rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 text-sm outline-none ring-teal-500 focus:ring-2 md:col-span-2"
            />
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 text-sm outline-none ring-teal-500 focus:ring-2"
            >
              <option value="">All specialties</option>
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-[#d7e5e2] bg-white px-3 py-2.5 text-sm outline-none ring-teal-500 focus:ring-2"
            >
              <option value="">All locations</option>
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {providerError ? (
            <p className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {providerError}
            </p>
          ) : null}

          {loadingProviders ? (
            <p className="text-sm text-slate-500">Loading providers...</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  selected={selectedProvider?.id === provider.id}
                  onSelect={handleSelectProvider}
                />
              ))}
            </div>
          )}

          {!loadingProviders && !providers.length && !providerError ? (
            <p className="mt-4 text-sm text-slate-500">No providers matched your filters.</p>
          ) : null}
        </section>
      ) : null}

      {activeTab === "book" ? (
        <section className="glass-panel fade-up rounded-[28px] p-6 md:p-8">
          <h2 className="mb-2 text-2xl text-slate-900">Book a sample appointment</h2>
          <p className="mb-6 text-sm text-slate-600">
            Demo booking only. No real clinic integration and no medical diagnosis.
          </p>
          <BookingForm provider={selectedProvider} onBooked={handleBooked} />
        </section>
      ) : null}

      {activeTab === "assistant" ? (
        <section className="glass-panel fade-up rounded-[28px] p-6 md:p-8">
          <h2 className="mb-2 text-2xl text-slate-900">Ask HealthMate AI</h2>
          <p className="mb-6 text-sm text-slate-600">
            Get help with booking steps and general health education questions.
          </p>
          <AssistantChat />
        </section>
      ) : null}

      {activeTab === "appointments" ? (
        <section className="glass-panel fade-up rounded-[28px] p-6 md:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl text-slate-900">My appointments</h2>
              <p className="mt-1 text-sm text-slate-600">
                Sample bookings with AI-generated summaries.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadAppointments()}
              className="rounded-xl border border-[#d7e5e2] bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400"
            >
              Refresh
            </button>
          </div>
          <AppointmentsList appointments={appointments} loading={loadingAppointments} />
        </section>
      ) : null}

      <footer className="mt-10 text-center text-xs leading-5 text-slate-500">
        HealthMate AI is an educational demo for assessment purposes. It does not provide
        medical diagnosis, prescriptions, or emergency care.
      </footer>
    </main>
  );
}
