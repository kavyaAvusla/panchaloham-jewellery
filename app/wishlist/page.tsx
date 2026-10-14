"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { getSupabase } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import StateMessage from "@/components/ui/StateMessage";

export default function WishlistPage() {
  const { wishlist, ready } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "missing" | "error">("idle");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!ready) return;

    if (wishlist.length === 0) {
      setProducts([]);
      setStatus("ok");
      return;
    }

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
    setStatus("loading");
    (async () => {
      const { data, error: err } = await sb.client
        .from("products")
        .select("*")
        .in("id", wishlist)
        .eq("is_hidden", false);

      if (!active) return;
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }

      // Keep the order the customer saved them in.
      const byId = new Map((data as Product[]).map((p) => [p.id, p]));
      setProducts(wishlist.map((id) => byId.get(id)).filter(Boolean) as Product[]);
      setStatus("ok");
    })();

    return () => {
      active = false;
    };
  }, [ready, wishlist]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="font-serif text-3xl text-navy sm:text-4xl">Wishlist</h1>
      <p className="mt-2 text-sm text-navy/60">Items you saved with the heart button.</p>

      <div className="mt-8">
        {status === "missing" && <StateMessage kind="missing" setting={missing} />}
        {status === "error" && <StateMessage kind="error" message={error} />}
        {status === "loading" && <p className="text-sm text-navy/50">Loading wishlist...</p>}

        {status === "ok" && products.length === 0 && (
          <div className="rounded-4xl border border-navy/10 bg-white p-8 text-center">
            <p className="text-navy/70">Your wishlist is empty.</p>
            <p className="mt-1 text-sm text-navy/50">
              Tap the heart on any product to save it here.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
            >
              Back to Home
            </Link>
          </div>
        )}

        {status === "ok" && products.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
