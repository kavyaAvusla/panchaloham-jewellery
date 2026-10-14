"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import StateMessage from "@/components/ui/StateMessage";

type Order = {
  id: string;
  user_id: string;
  total: number | null;
  status: string;
  payment_status: string;
  pincode: string | null;
  created_at: string;
};

type Item = {
  order_id: string;
  product_name: string;
  product_code: string | null;
  quantity: number;
  line_total: number | null;
};

const STATUSES = ["placed", "packed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [status, setStatus] = useState<"loading" | "ok" | "missing" | "error">("loading");
  const [missing, setMissing] = useState<string>();
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  const load = useCallback(async () => {
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

    const [oRes, iRes] = await Promise.all([
      sb.client.from("orders").select("*").order("created_at", { ascending: false }),
      sb.client.from("order_items").select("order_id,product_name,product_code,quantity,line_total"),
    ]);

    if (oRes.error || iRes.error) {
      setError((oRes.error || iRes.error)?.message);
      setStatus("error");
      return;
    }

    setOrders((oRes.data as Order[]) ?? []);
    const grouped: Record<string, Item[]> = {};
    for (const it of (iRes.data as Item[]) ?? []) {
      (grouped[it.order_id] ??= []).push(it);
    }
    setItems(grouped);
    setStatus("ok");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: string, next: string) {
    const sb = getSupabase();
    if (sb.state !== "ok") return;
    const { error: err } = await sb.client.from("orders").update({ status: next }).eq("id", id);
    if (err) {
      setError(err.message);
      return;
    }
    setNotice(`Order marked ${next}.`);
    await load();
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-navy sm:text-3xl">Orders</h1>

      {status === "missing" && <div className="mt-6"><StateMessage kind="missing" setting={missing} /></div>}
      {status === "error" && <div className="mt-6"><StateMessage kind="error" message={error} /></div>}
      {notice && <p className="mt-4 text-sm text-emerald-700">{notice}</p>}

      {status === "ok" && orders.length === 0 && (
        <div className="mt-6"><StateMessage kind="empty" title="No orders yet" /></div>
      )}

      {status === "ok" && orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-navy/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-navy">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-navy/50">
                    {new Date(o.created_at).toLocaleString("en-IN")} · Pincode {o.pincode ?? "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-navy">{formatPrice(o.total)}</p>
                  <p className="text-xs text-navy/50">Payment: {o.payment_status}</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-navy/70">
                {(items[o.id] ?? []).map((it, idx) => (
                  <li key={idx}>
                    {it.product_name} {it.product_code ? `(${it.product_code})` : ""} × {it.quantity} —{" "}
                    {formatPrice(it.line_total)}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-sm text-navy/70">
                  Status
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                    className="ml-2 rounded-xl border border-navy/15 px-3 py-2 text-sm outline-none focus:border-brand"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
