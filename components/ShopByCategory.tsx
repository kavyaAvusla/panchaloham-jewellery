"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StateMessage from "@/components/ui/StateMessage";
import { ArrowRight } from "@/components/ui/Icons";

export default function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
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

    let cancelled = false;
    (async () => {
      const { data, error: err } = await sb.client
        .from("categories")
        .select("id,name,slug,photo_url,sort_order,is_hidden")
        .eq("is_hidden", false)
        .order("sort_order", { ascending: true });

      if (cancelled) return;
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      setCategories((data as Category[]) ?? []);
      setStatus("ok");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-brand">Browse</p>
        <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Shop By Category</h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-px w-12 bg-brand/40" />
          <span className="diamond" />
          <span className="h-px w-12 bg-brand/40" />
        </div>
      </div>

      {status === "missing" && <StateMessage kind="missing" setting={missing} />}
      {status === "error" && <StateMessage kind="error" message={error} />}
      {status === "ok" && categories.length === 0 && (
        <StateMessage kind="empty" title="No categories yet" />
      )}

      {status === "ok" && categories.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group overflow-hidden rounded-4xl border border-navy/10 bg-white transition hover:shadow-soft"
            >
              <div className="aspect-[4/3]">
                <PlaceholderImage src={c.photo_url} alt={c.name} label={c.name} />
              </div>
              <div className="flex items-center justify-between gap-3 p-5">
                <span className="font-serif text-lg text-navy">{c.name}</span>
                <span className="inline-flex items-center gap-1 text-sm text-brand">
                  Explore Now
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
