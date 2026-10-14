"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [offers, setOffers] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      return;
    }
    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }

    setBusy(true);
    setError(undefined);
    setMessage(undefined);

    const { data, error: err } = await sb.client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim(), phone: phone.trim(), offers_opt_in: offers },
      },
    });

    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }

    setBusy(false);

    // If email confirmation is ON in Supabase, there is no session yet.
    if (!data.session) {
      setMessage("Account created. Please check your email to confirm, then log in.");
      return;
    }
    router.replace("/account");
  }

  const input = "mt-1 w-full rounded-xl border border-navy/15 px-3 py-3 text-base outline-none focus:border-brand";

  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-4xl border border-navy/10 bg-white p-7 shadow-soft sm:p-8">
        <h1 className="font-serif text-2xl text-navy">Create account</h1>
        <p className="mt-2 text-sm text-navy/60">Save your addresses and see your orders.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-navy/70">
            Full name
            <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
          </label>
          <label className="block text-sm font-medium text-navy/70">
            Phone
            <input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
          </label>
          <label className="block text-sm font-medium text-navy/70">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          </label>
          <label className="block text-sm font-medium text-navy/70">
            Password
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          </label>

          <label className="flex items-start gap-2 text-sm text-navy/70">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5"
              checked={offers}
              onChange={(e) => setOffers(e.target.checked)}
            />
            I want to get offers
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Creating..." : "Create account"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
        {message && <p className="mt-4 text-sm text-emerald-700">{message}</p>}

        <p className="mt-5 text-sm text-navy/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
