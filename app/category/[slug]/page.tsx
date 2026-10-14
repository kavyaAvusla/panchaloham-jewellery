"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import StateMessage from "@/components/ui/StateMessage";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!slug) return;
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
      const { data: cat, error: catErr } = await sb.client
        .from("categories")
        .select("id,name,slug,photo_url,sort_order,is_hidden")
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;
      if (catErr) {
        setError(catErr.message);
        setStatus("error");
        return;
      }
      if (!cat) {
        setStatus("notfound");
        return;
      }
      setCategory(cat as Category);

      const { data: prods, error: prodErr } = await sb.client
        .from("products")
        .select("*")
        .eq("category_id", (cat as Category).id)
        .eq("is_hidden", false)
        .limit(60);

      if (cancelled) return;
      if (prodErr) {
        setError(prodErr.message);
        setStatus("error");
        return;
      }
      setProducts((prods as Product[]) ?? []);
      setStatus("ok");
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <Link href="/" className="text-sm text-navy/60 hover:text-brand">
        &larr; Back to Home
      </Link>

      <div className="mt-6">
        {status === "missing" && <StateMessage kind="missing" setting={missing} />}
        {status === "error" && <StateMessage kind="error" message={error} />}
        {status === "notfound" && (
          <div className="rounded-4xl border border-navy/10 bg-white p-8">
            <p className="font-semibold text-navy">Category not found</p>
            <p className="mt-1 text-sm text-navy/60">This category does not exist or is hidden.</p>
          </div>
        )}
        {status === "loading" && <p className="text-sm text-navy/50">Loading...</p>}
      </div>

      {status === "ok" && category && (
        <>
          {category.photo_url && (
            <div className="mt-6 h-40 w-full overflow-hidden rounded-4xl shadow-soft sm:h-64">
              <PlaceholderImage
                src={category.photo_url}
                alt={`${category.name} banner`}
                label={category.name}
              />
            </div>
          )}

          <header className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brand">Category</p>
            <h1 className="mt-3 font-serif text-3xl text-navy sm:text-5xl">{category.name}</h1>
            <div className="mt-4 flex items-center gap-3" aria-hidden>
              <span className="h-px w-12 bg-brand/40" />
              <span className="diamond" />
              <span className="h-px w-12 bg-brand/40" />
            </div>
          </header>

          {products.length === 0 ? (
            <div className="mt-10">
              <StateMessage kind="empty" title="No products in this category yet" />
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
