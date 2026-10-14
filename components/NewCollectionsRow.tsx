"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/CartProvider";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { HeartIcon } from "@/components/ui/Icons";
import StateMessage from "@/components/ui/StateMessage";

/**
 * New Collections — 12 newest products, auto-scrolling card row (scrolls left).
 * Data: Supabase only (products, newest first). Nothing is invented.
 */

// Scroll speed in pixels per second (slow).
const SPEED_PX_PER_SEC = 40;

function Card({ p }: { p: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const photo = p.photo_urls?.[0] ?? null;
  const wished = isWishlisted(p.id);

  return (
    <div className="flex h-full w-[150px] shrink-0 flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-soft sm:w-[170px]">
      {/* Bigger image area (top) with a white frame */}
      <div className="min-h-0 w-full flex-1 bg-white p-1">
        <div className="relative h-full w-full overflow-hidden rounded-2xl bg-lilac">
          <Link href={`/product/${p.id}`} draggable={false} className="block h-full w-full">
            <PlaceholderImage src={photo} alt={p.name} label={p.name} />
          </Link>
          <button
            type="button"
            onClick={() => toggleWishlist(p.id)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            className={`absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition ${
              wished ? "text-brand" : "text-navy/50 hover:text-brand"
            }`}
          >
            <HeartIcon filled={wished} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Details area (bottom) — name, code, then price on its own line */}
      <div className="flex h-[58px] shrink-0 items-center gap-2 px-2.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold leading-tight text-navy">{p.name}</p>
          <p className="truncate text-[10px] leading-tight text-navy/50">Code: {p.code}</p>
          <p className="truncate text-[11px] font-semibold leading-tight text-brand">
            {formatPrice(p.price)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => addToCart(p)}
          aria-label={`Add ${p.name} to cart`}
          className="shrink-0 rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-white transition hover:brightness-110"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default function NewCollectionsRow() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false });

  // ---- Load the 12 newest products from Supabase ----
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
        .from("products")
        .select("*")
        .eq("is_hidden", false)
        .order("created_at", { ascending: false })
        .limit(12);

      if (cancelled) return;
      if (err) {
        setError(err.message);
        setStatus("error");
        return;
      }
      setProducts((data as Product[]) ?? []);
      setStatus("ok");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Auto-scroll (leftward) with a float accumulator so sub-pixel steps work ----
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || products.length < 2) return;

    let raf = 0;
    let last = performance.now();
    posRef.current = el.scrollLeft;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;

      const half = el.scrollWidth / 2;

      if (pausedRef.current || dragRef.current.active) {
        // Stay in sync with the user's swipe/drag position.
        posRef.current = el.scrollLeft;
      } else if (half > 0) {
        posRef.current += (SPEED_PX_PER_SEC * dt) / 1000; // move content left
        if (posRef.current >= half) posRef.current -= half;
        if (posRef.current < 0) posRef.current += half;
        el.scrollLeft = posRef.current;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [products]);

  function onPointerDown(e: React.PointerEvent) {
    pausedRef.current = true;
    if (e.pointerType === "touch") return; // touch uses native swipe
    const el = scrollerRef.current;
    if (!el) return;
    dragRef.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft, moved: false };
  }

  function onPointerMove(e: React.PointerEvent) {
    const el = scrollerRef.current;
    if (!el || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 4) dragRef.current.moved = true;
    el.scrollLeft = dragRef.current.startScroll - dx;
    posRef.current = el.scrollLeft;
  }

  function endDrag() {
    dragRef.current.active = false;
    pausedRef.current = false;
  }

  function onClickCapture(e: React.MouseEvent) {
    if (dragRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current.moved = false;
    }
  }

  // Two identical halves so the loop is seamless (no jump).
  const perHalf: Product[] = [];
  if (products.length > 0) {
    const times = Math.max(1, Math.ceil(12 / products.length));
    for (let i = 0; i < times; i++) perHalf.push(...products);
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto mb-4 max-w-6xl px-5 text-center">
        <h2 className="font-serif text-xl text-navy sm:text-2xl">New Collections</h2>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2" aria-hidden>
          <span className="h-px w-10 bg-brand/40" />
          <span className="diamond" />
          <span className="h-px w-10 bg-brand/40" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5">
        {status === "missing" && <StateMessage kind="missing" setting={missing} />}
        {status === "error" && <StateMessage kind="error" message={error} />}
        {status === "loading" && <p className="text-sm text-navy/50">Loading new collections...</p>}
        {status === "ok" && products.length === 0 && (
          <StateMessage kind="empty" title="No products yet" />
        )}
      </div>

      {status === "ok" && products.length > 0 && (
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerEnter={() => {
            pausedRef.current = true;
          }}
          onTouchStart={() => {
            pausedRef.current = true;
          }}
          onTouchEnd={() => {
            pausedRef.current = false;
          }}
          onClickCapture={onClickCapture}
          className="no-scrollbar w-full cursor-grab select-none overflow-x-auto active:cursor-grabbing"
          style={{ height: "170px", touchAction: "pan-x" }}
        >
          <div className="flex w-max">
            <div className="flex h-[170px] gap-3 pr-3 sm:gap-4 sm:pr-4">
              {perHalf.map((p, i) => (
                <Card key={`a-${p.id}-${i}`} p={p} />
              ))}
            </div>
            <div className="flex h-[170px] gap-3 pr-3 sm:gap-4 sm:pr-4" aria-hidden>
              {perHalf.map((p, i) => (
                <Card key={`b-${p.id}-${i}`} p={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
