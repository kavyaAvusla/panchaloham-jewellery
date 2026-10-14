"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/CartProvider";
import { CartIcon, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/Icons";
import StateMessage from "@/components/ui/StateMessage";

const TABS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

type Result = { id: string; name: string; code: string; price: number | null };

export default function Header() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useCart();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ok">("idle");
  const [missing, setMissing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setState("idle");
      setMissing(null);
      setError(null);
      return;
    }

    const sb = getSupabase();
    if (sb.state === "missing") {
      setMissing(sb.setting);
      setState("idle");
      setResults([]);
      return;
    }
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      setState("idle");
      return;
    }

    let cancelled = false;
    setState("loading");
    const safe = term.replace(/[,()*%\\]/g, " ").trim();

    const timer = setTimeout(async () => {
      const { data, error: err } = await sb.client
        .from("products")
        .select("id,name,code,price")
        .eq("is_hidden", false)
        .or(`name.ilike.%${safe}%,code.ilike.%${safe}%`)
        .limit(6);

      if (cancelled) return;
      if (err) {
        setError(err.message);
        setState("idle");
        setResults([]);
        return;
      }
      setResults((data as Result[]) ?? []);
      setState("ok");
      setMissing(null);
      setError(null);
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const showPanel = open && (q.trim().length >= 2);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-serif text-lg text-white">
            P
          </span>
          <span className="font-serif text-lg leading-tight text-navy sm:text-xl">
            Panchaloham
            <span className="block text-[10px] uppercase tracking-[0.2em] text-brand">
              Jewellery
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={`relative py-1 text-sm ${
                isActive(t.href) ? "text-navy" : "text-navy/60 hover:text-navy"
              }`}
            >
              {t.label}
              {isActive(t.href) && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded bg-brand" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div ref={boxRef} className="relative">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-navy/70 hover:bg-lilac hover:text-navy"
            >
              <SearchIcon />
            </button>

            {showPanel && (
              <div className="absolute right-0 top-12 w-[300px] rounded-2xl border border-navy/10 bg-white p-3 shadow-soft sm:w-[360px]">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name or code"
                  className="w-full rounded-xl border border-navy/15 px-3 py-2 text-sm outline-none focus:border-brand"
                />

                <div className="mt-3 max-h-72 overflow-y-auto">
                  {missing && <StateMessage kind="missing" setting={missing} />}
                  {error && <StateMessage kind="error" message={error} />}
                  {!missing && !error && state === "loading" && (
                    <p className="px-1 py-3 text-sm text-navy/50">Searching...</p>
                  )}
                  {!missing && !error && state === "ok" && results.length === 0 && (
                    <p className="px-1 py-3 text-sm text-navy/50">
                      No products match “{q.trim()}”. Try a name or a jewellery code.
                    </p>
                  )}
                  <ul className="divide-y divide-navy/5">
                    {results.map((r) => (
                      <li key={r.id}>
                        <Link
                          href={`/product/${r.id}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-3 rounded-lg px-1 py-2 hover:bg-lilac/50"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm text-navy">{r.name}</span>
                            <span className="text-xs text-navy/50">Code: {r.code}</span>
                          </span>
                          <span className="shrink-0 text-sm text-brand">{formatPrice(r.price)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/account"
            aria-label="My Account"
            className="flex h-10 w-10 items-center justify-center rounded-full text-navy/70 hover:bg-lilac hover:text-navy"
          >
            <UserIcon />
          </Link>

          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} item${wishlist.length === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy/70 hover:bg-lilac hover:text-navy"
          >
            <HeartIcon />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-navy/70 hover:bg-lilac hover:text-navy"
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile tabs: horizontal scroll so nothing overflows at 375px */}
      <nav className="flex gap-5 overflow-x-auto px-5 pb-2 md:hidden">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`relative whitespace-nowrap py-1 text-sm ${
              isActive(t.href) ? "text-navy" : "text-navy/60"
            }`}
          >
            {t.label}
            {isActive(t.href) && (
              <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded bg-brand" />
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
