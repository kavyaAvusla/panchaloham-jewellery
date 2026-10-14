"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const [kind, setKind] = useState<"idle" | "error" | "missing">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (sb.state === "missing") {
      setKind("missing");
      setMessage(sb.setting);
      return;
    }
    if (sb.state !== "ok") {
      setKind("error");
      setMessage("Supabase is not configured.");
      return;
    }

    setBusy(true);
    setKind("idle");
    setMessage(undefined);

    const { data, error } = await sb.client.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setKind("error");
      setMessage(error.message);
      return;
    }

    const uid = data.user?.id;
    const { data: profile, error: perr } = await sb.client
      .from("users")
      .select("role")
      .eq("id", uid as string)
      .maybeSingle();

    if (perr) {
      await sb.client.auth.signOut();
      setBusy(false);
      setKind("error");
      setMessage(perr.message);
      return;
    }
    if (profile?.role !== "admin") {
      await sb.client.auth.signOut();
      setBusy(false);
      setKind("error");
      setMessage("This account is not an admin.");
      return;
    }

    router.replace("/admin");
  }

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="rounded-4xl border border-navy/10 bg-white p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.25em] text-brand">Owner only</p>
        <h1 className="mt-3 font-serif text-2xl text-navy">Admin Login</h1>
        <p className="mt-2 text-sm text-navy/60">This page is not shown to customers.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm text-navy/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-navy/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-navy/15 px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {kind === "error" && <p className="mt-4 text-sm text-rose-700">{message}</p>}
        {kind === "missing" && (
          <p className="mt-4 text-sm text-amber-700">
            Setting missing: <code>{message}</code>
          </p>
        )}
      </div>
    </div>
  );
}
