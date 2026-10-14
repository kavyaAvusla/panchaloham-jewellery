"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";

type Order = {
  id: string;
  subtotal: number | null;
  delivery_charge: number | null;
  total: number | null;
  status: string;
  payment_status: string;
  pincode: string | null;
  created_at: string;
};

type Item = {
  id: string;
  product_name: string;
  product_code: string | null;
  unit_price: number | null;
  quantity: number;
  line_total: number | null;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [pay, setPay] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "error">("loading");
  const [error, setError] = useState<string>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("order");
    setPay(params.get("pay"));
    if (!id) {
      setStatus("notfound");
      return;
    }
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setError("Supabase is not configured.");
      setStatus("error");
      return;
    }
    let active = true;
    (async () => {
      const { data: o, error: e1 } = await sb.client
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      if (e1) {
        setError(e1.message);
        setStatus("error");
        return;
      }
      if (!o) {
        setStatus("notfound");
        return;
      }
      setOrder(o as Order);
      const { data: it } = await sb.client.from("order_items").select("*").eq("order_id", id);
      if (!active) return;
      setItems((it as Item[]) ?? []);
      setStatus("ok");
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-5 py-14">
      {status === "loading" && <p className="text-sm text-navy/50">Loading...</p>}

      {status === "error" && (
        <div className="rounded-4xl border border-rose-300 bg-rose-50 p-6 text-sm text-rose-800">
          Could not load the order. {error}
        </div>
      )}

      {status === "notfound" && (
        <div className="rounded-4xl border border-navy/10 bg-white p-8 text-center">
          <p className="font-semibold text-navy">Order not found</p>
          <Link href="/" className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
            Back to Home
          </Link>
        </div>
      )}

      {status === "ok" && order && (
        <>
          <div className="rounded-4xl border border-emerald-300 bg-emerald-50 p-6 text-center">
            <p className="font-serif text-2xl text-navy">Thank you!</p>
            <p className="mt-1 text-sm text-emerald-800">
              Your order has been placed. We will contact you on your phone.
            </p>
            <p className="mt-2 text-sm text-navy/70">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {order.payment_status !== "paid" && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Payment: To be confirmed. Online payment (UPI / cards) is switched on once the
              payment gateway keys are added.
              {pay === "failed" && " The last payment attempt did not complete."}
            </div>
          )}

          <div className="mt-6 rounded-3xl border border-navy/10 bg-white p-6">
            <p className="text-sm text-navy/50">
              Placed on {new Date(order.created_at).toLocaleString("en-IN")}
            </p>

            <ul className="mt-4 divide-y divide-navy/5">
              {items.map((it) => (
                <li key={it.id} className="flex justify-between gap-3 py-2 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate text-navy">{it.product_name}</span>
                    <span className="text-xs text-navy/50">
                      {it.product_code ? `Code: ${it.product_code} · ` : ""}
                      Qty {it.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 text-navy/70">{formatPrice(it.line_total)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 border-t border-navy/10 pt-4 text-sm">
              <div className="flex justify-between text-navy/80">
                <span>Items total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy/80">
                <span>Delivery</span>
                <span className="text-navy/50">To be confirmed</span>
              </div>
              <div className="flex justify-between font-semibold text-navy">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <p className="mt-4 text-xs text-navy/50">
              Shop name, address and invoice details: To be confirmed.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="rounded-full border border-navy/20 px-5 py-2.5 text-sm text-navy"
              >
                Print / Save as PDF
              </button>
              <Link href="/account" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
                My Orders
              </Link>
              <Link href="/" className="rounded-full border border-navy/20 px-5 py-2.5 text-sm text-navy">
                Continue shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
