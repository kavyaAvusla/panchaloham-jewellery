"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice, hasPrice } from "@/lib/format";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

export default function CartPage() {
  const { lines, setQty, removeFromCart, cartCount, ready } = useCart();

  const knownTotal = lines.reduce(
    (sum, l) => sum + (hasPrice(l.price) ? Number(l.price) * l.qty : 0),
    0
  );
  const hasUnpriced = lines.some((l) => !hasPrice(l.price));

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <h1 className="font-serif text-3xl text-navy sm:text-4xl">Your Cart</h1>
      <p className="mt-2 text-sm text-navy/60">
        {ready ? `${cartCount} item${cartCount === 1 ? "" : "s"}` : "Loading..."}
      </p>

      {ready && lines.length === 0 && (
        <div className="mt-8 rounded-4xl border border-navy/10 bg-white p-8 text-center">
          <p className="text-navy/70">Your cart is empty.</p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      )}

      {lines.length > 0 && (
        <div className="mt-8 space-y-4">
          {lines.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-4 rounded-3xl border border-navy/10 bg-white p-3"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <PlaceholderImage src={l.photo} alt={l.name} label={l.name} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{l.name}</p>
                <p className="text-xs text-navy/50">Code: {l.code}</p>
                <p className="mt-1 text-sm text-brand">{formatPrice(l.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQty(l.id, l.qty - 1)}
                  className="h-8 w-8 rounded-full border border-navy/15 text-navy/70"
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="w-6 text-center text-sm">{l.qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(l.id, l.qty + 1)}
                  className="h-8 w-8 rounded-full border border-navy/15 text-navy/70"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(l.id)}
                className="text-xs text-navy/50 hover:text-rose-600"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="rounded-3xl bg-lilac p-6">
            <div className="flex items-center justify-between text-sm text-navy">
              <span>Items total</span>
              <span className="font-semibold">{formatPrice(knownTotal)}</span>
            </div>
            {hasUnpriced && (
              <p className="mt-2 text-xs text-navy/60">
                Some items have no price yet (Price to be confirmed) and are not included in the
                total.
              </p>
            )}
            <p className="mt-3 text-xs text-navy/60">
              Delivery charges, taxes and checkout: To be confirmed.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 w-full cursor-not-allowed rounded-full bg-brand/40 px-6 py-3 text-sm font-semibold text-white"
              title="Checkout: To be confirmed"
            >
              Checkout — To be confirmed
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
