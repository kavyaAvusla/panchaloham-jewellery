"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "missing" | "error">("idle");
  const [missing, setMissing] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;

    const sb = getSupabase();
    if (sb.state === "missing") {
      setMissing(sb.setting);
      setStatus("missing");
      return;
    }
    if (sb.state !== "ok") {
      setMessage("Supabase is not configured.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    const { error } = await sb.client.from("newsletter_subscribers").insert({ email: value });
    if (error) {
      setMessage(error.message);
      setStatus("error");
      return;
    }
    setEmail("");
    setStatus("done");
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label htmlFor="newsletter" className="text-xs uppercase tracking-[0.2em] text-navy/60">
        Newsletter
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="newsletter"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="min-w-0 flex-1 rounded-full border border-navy/15 px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Join"}
        </button>
      </div>

      {status === "done" && (
        <p className="mt-2 text-xs text-emerald-700">Thank you. You are on the list.</p>
      )}
      {status === "missing" && (
        <p className="mt-2 text-xs text-amber-700">
          Setting missing: <code>{missing}</code>.
        </p>
      )}
      {status === "error" && <p className="mt-2 text-xs text-rose-700">{message}</p>}
    </form>
  );
}
