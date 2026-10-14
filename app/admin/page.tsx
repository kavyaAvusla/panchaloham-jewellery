"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import StateMessage from "@/components/ui/StateMessage";

type Counts = { products: number; categories: number; orders: number; enquiries: number };

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>();
  const [status, setStatus] = useState<"loading" | "ok" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const sb = getSupabase();
    if (sb.state === "missing") {
      setMissing(sb.setting);
      setStatus("missing");
      return;
    }
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      setStatus("error");
      return;
    }

    let active = true;
    (async () => {
      const [p, c, o, e] = await Promise.all([
        sb.client.from("products").select("*", { count: "exact", head: true }),
        sb.client.from("categories").select("*", { count: "exact", head: true }),
        sb.client.from("orders").select("*", { count: "exact", head: true }),
        sb.client.from("enquiries").select("*", { count: "exact", head: true }),
      ]);
      if (!active) return;
      const firstErr = p.error || c.error || o.error || e.error;
      if (firstErr) {
        setError(firstErr.message);
        setStatus("error");
        return;
      }
      setCounts({
        products: p.count ?? 0,
        categories: c.count ?? 0,
        orders: o.count ?? 0,
        enquiries: e.count ?? 0,
      });
      setStatus("ok");
    })();

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    { label: "Products", value: counts?.products, href: "/admin/products" },
    { label: "Categories", value: counts?.categories },
    { label: "Orders", value: counts?.orders, href: "/admin/orders" },
    { label: "Enquiries", value: counts?.enquiries },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy sm:text-3xl">Dashboard</h1>

      {status === "missing" && <div className="mt-6"><StateMessage kind="missing" setting={missing} /></div>}
      {status === "error" && <div className="mt-6"><StateMessage kind="error" message={error} /></div>}
      {status === "loading" && <p className="mt-6 text-sm text-navy/50">Loading...</p>}

      {status === "ok" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const inner = (
              <div className="rounded-3xl border border-navy/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-navy/50">{c.label}</p>
                <p className="mt-2 font-serif text-3xl text-navy">{c.value ?? 0}</p>
              </div>
            );
            return c.href ? (
              <Link key={c.label} href={c.href} className="block transition hover:shadow-soft">
                {inner}
              </Link>
            ) : (
              <div key={c.label}>{inner}</div>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-6">
        <p className="text-sm font-semibold text-navy">Coming next</p>
        <p className="mt-1 text-sm text-navy/60">
          Enquiries, customers, categories, offers and offer messages will be added in the next
          admin slice.
        </p>
      </div>
    </div>
  );
}
