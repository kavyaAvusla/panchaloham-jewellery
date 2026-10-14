"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice, hasPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StateMessage from "@/components/ui/StateMessage";
import { HeartIcon, WhatsAppIcon } from "@/components/ui/Icons";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) return;
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
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      if (!data) {
        setStatus("notfound");
        return;
      }
      setProduct(data as Product);
      setStatus("ok");
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/" className="text-sm text-navy/60 hover:text-brand">
        &larr; Back
      </Link>

      <div className="mt-6">
        {status === "missing" && <StateMessage kind="missing" setting={missing} />}
        {status === "error" && <StateMessage kind="error" message={error} />}
        {status === "notfound" && (
          <div className="rounded-4xl border border-navy/10 bg-white p-8">
            <p className="font-semibold text-navy">Product not found</p>
            <p className="mt-1 text-sm text-navy/60">
              This item is not in the catalogue, or it has been hidden.
            </p>
          </div>
        )}
        {status === "loading" && <p className="text-sm text-navy/50">Loading...</p>}
      </div>

      {status === "ok" && product && (
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="aspect-square w-full overflow-hidden rounded-4xl shadow-soft">
            <PlaceholderImage
              src={product.photo_urls?.[0] ?? null}
              alt={product.name}
              label={product.name}
            />
          </div>

          <div>
            <h1 className="font-serif text-3xl text-navy sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-navy/60">Code: {product.code}</p>
            <p className={`mt-4 text-2xl font-semibold ${hasPrice(product.price) ? "text-navy" : "text-navy/50"}`}>
              {formatPrice(product.price)}
            </p>
            <p className="mt-3 text-sm text-navy/50">No reviews yet</p>
            <p className="mt-6 text-sm leading-relaxed text-navy/70">
              Details for this piece: To be confirmed.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={isWishlisted(product.id)}
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3.5 text-sm text-navy transition hover:border-brand hover:text-brand"
              >
                <HeartIcon filled={isWishlisted(product.id)} className="h-4 w-4" />
                Wishlist
              </button>

              <button
                type="button"
                title="WhatsApp number: To be confirmed"
                className="inline-flex items-center gap-2 rounded-full border border-navy/20 px-6 py-3.5 text-sm text-navy/60"
              >
                <WhatsAppIcon className="h-4 w-4 text-brand" />
                Order on WhatsApp
              </button>
            </div>

            <p className="mt-4 text-xs text-navy/50">
              Size options, delivery and return details: To be confirmed.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
