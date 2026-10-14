"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import StateMessage from "@/components/ui/StateMessage";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();
  const trackRef = useRef<HTMLDivElement>(null);

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
      // select("*") so the page never breaks if optional columns are not added yet
      const { data, error: err } = await sb.client
        .from("products")
        .select("*")
        .eq("is_hidden", false)
        .limit(24);

      if (cancelled) return;
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }

      const all = (data as Product[]) ?? [];
      const flagged = all.filter((p) => p.is_best_seller === true);
      // Only products explicitly marked as best sellers appear here.
      setProducts(flagged.slice(0, 12));
      setStatus("ok");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand">Loved by customers</p>
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl">Best Sellers</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-navy/15 text-navy/70 transition hover:border-brand hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-white transition hover:brightness-110"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {status === "missing" && <StateMessage kind="missing" setting={missing} />}
      {status === "error" && <StateMessage kind="error" message={error} />}
      {status === "ok" && products.length === 0 && (
        <StateMessage
          kind="empty"
          title="Best sellers coming soon"
          description="No products are marked as Best Sellers yet."
        />
      )}
      {status === "loading" && (
        <p className="text-sm text-navy/50">Loading products...</p>
      )}

      {status === "ok" && products.length > 0 && (
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        >
          {products.map((p) => (
            <div key={p.id} className="w-[220px] shrink-0 snap-start sm:w-[250px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
