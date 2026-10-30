"use client";

import { FormEvent, useState } from "react";
import { askAssistant } from "@/lib/api";

type Message = {
  role: "user" | "assistant";
  content: string;
  source?: string;
};

export function AssistantChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help with appointment booking steps and general health education. I do not diagnose or prescribe medication.",
      source: "system",
    },
  ]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setLoading(true);

    try {
      const response = await askAssistant(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.reply,
          source: response.source,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? err.message
              : "Unable to reach the AI assistant right now.",
          source: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="mb-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-[#d7e5e2] bg-slate-50/80 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-teal-700 text-white"
                : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.role === "assistant" && message.source ? (
              <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                source: {message.source}
              </p>
            ) : null}
          </div>
        ))}
        {loading ? (
          <div className="w-fit rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Thinking...
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about booking or general health education..."
          className="flex-1 rounded-xl border border-[#d7e5e2] bg-white px-3 py-3 text-sm outline-none ring-teal-500 focus:ring-2"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          Ask AI
        </button>
      </form>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        Educational information only. Not a substitute for professional medical advice.
      </p>
    </div>
  );
}
