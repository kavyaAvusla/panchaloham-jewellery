"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      return;
    }
    setBusy(true);
    setError(undefined);
    const { error: err } = await sb.client.auth.signInWithPassword({ email, password });
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    router.replace("/account");
  }

  const input = "mt-1 w-full rounded-xl border border-navy/15 px-3 py-3 text-base outline-none focus:border-brand";

  return (
    <section className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-4xl border border-navy/10 bg-white p-7 shadow-soft sm:p-8">
        <h1 className="font-serif text-2xl text-navy">Login</h1>
        <p className="mt-2 text-sm text-navy/60">Sign in to order and see your orders.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-navy/70">
            Email
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
          </label>
          <label className="block text-sm font-medium text-navy/70">
            Password
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}

        <p className="mt-5 text-sm text-navy/60">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-brand">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
