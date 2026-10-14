"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";

type Order = {
  id: string;
  total: number | null;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [fullName, setFullName] = useState<string>("");
  const [offers, setOffers] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await sb.client.auth.getUser();
      if (!active) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? undefined);

      const [profileRes, ordersRes] = await Promise.all([
        sb.client.from("users").select("full_name,offers_opt_in").eq("id", user.id).maybeSingle(),
        sb.client
          .from("orders")
          .select("id,total,status,payment_status,created_at")
          .order("created_at", { ascending: false }),
      ]);

      if (!active) return;
      if (profileRes.error) setError(profileRes.error.message);
      const p = profileRes.data as { full_name: string | null; offers_opt_in: boolean } | null;
      setFullName(p?.full_name ?? "");
      setOffers(p?.offers_opt_in ?? false);
      setOrders((ordersRes.data as Order[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function updateOffers(next: boolean) {
    const sb = getSupabase();
    if (sb.state !== "ok" || !userId) return;
    setOffers(next);
    const { error: err } = await sb.client
      .from("users")
      .update({ offers_opt_in: next })
      .eq("id", userId);
    if (err) setError(err.message);
  }

  async function signOut() {
    const sb = getSupabase();
    if (sb.state === "ok") await sb.client.auth.signOut();
    router.replace("/");
  }

  if (loading) {
    return <section className="mx-auto max-w-4xl px-5 py-16"><p className="text-sm text-navy/50">Loading...</p></section>;
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-serif text-3xl text-navy sm:text-4xl">My Account</h1>

      {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}

      <div className="mt-6 rounded-3xl border border-navy/10 bg-white p-6">
        <p className="text-sm text-navy/60">Signed in as</p>
        <p className="mt-1 font-medium text-navy">{fullName || "Customer"}</p>
        <p className="text-sm text-navy/60">{email}</p>

        <label className="mt-5 flex items-center gap-2 text-sm text-navy/70">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={offers}
            onChange={(e) => updateOffers(e.target.checked)}
          />
          I want to get offers
        </label>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/wishlist" className="rounded-full border border-navy/20 px-5 py-2.5 text-sm text-navy">
            My Wishlist
          </Link>
          <button onClick={signOut} className="rounded-full border border-navy/20 px-5 py-2.5 text-sm text-navy">
            Sign out
          </button>
        </div>
      </div>

      <h2 className="mt-10 font-serif text-2xl text-navy">My Orders</h2>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-navy/10 bg-white p-6 text-sm text-navy/60">
          You have no orders yet.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy/10 bg-white p-4">
              <div>
                <p className="text-sm font-medium text-navy">
                  Order #{o.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-navy/50">
                  {new Date(o.created_at).toLocaleDateString("en-IN")} · {o.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-navy">{formatPrice(o.total)}</p>
                <p className="text-xs text-navy/50">Payment: {o.payment_status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
