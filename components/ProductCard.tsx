"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatPrice, hasPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { HeartIcon, StarIcon } from "@/components/ui/Icons";

type Props = {
  product: Product;
  rating?: number | null;
  reviewCount?: number | null;
};

export default function ProductCard({ product, rating, reviewCount }: Props) {
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const wished = isWishlisted(product.id);
  const photo = product.photo_urls?.[0] ?? null;
  const showStars = typeof rating === "number" && rating > 0 && (reviewCount ?? 0) > 0;

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-navy/10 bg-white p-3 transition hover:shadow-soft">
      <div className="relative overflow-hidden rounded-2xl">
        <Link href={`/product/${product.id}`} className="block aspect-square">
          <PlaceholderImage src={photo} alt={product.name} label={product.name} />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition ${
            wished ? "text-brand" : "text-navy/50 hover:text-brand"
          }`}
        >
          <HeartIcon filled={wished} className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col px-1">
        <Link href={`/product/${product.id}`} className="text-sm font-semibold text-navy hover:text-brand">
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-navy/50">Code: {product.code}</p>

        <div className="mt-2 flex items-center gap-1 text-xs">
          {showStars ? (
            <>
              <span className="flex text-brand" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} filled={i < Math.round(rating as number)} className="h-3.5 w-3.5" />
                ))}
              </span>
              <span className="text-navy/60">
                {(rating as number).toFixed(1)} ({reviewCount})
              </span>
            </>
          ) : (
            <span className="text-navy/40">No reviews yet</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className={`text-sm font-semibold ${hasPrice(product.price) ? "text-navy" : "text-navy/50"}`}>
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
