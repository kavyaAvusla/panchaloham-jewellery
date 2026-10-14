"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useCart } from "@/components/CartProvider";
import { formatPrice, hasPrice } from "@/lib/format";

type FormState = {
  name: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clearCart, ready } = useCart();

  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const sb = getSupabase();
    if (sb.state !== "ok") {
      setAuthChecked(true);
      return;
    }
    sb.client.auth.getUser().then(({ data }) => {
      if (data.user) {
        setLoggedIn(true);
        setUserId(data.user.id);
        setForm((f) => ({ ...f, email: data.user?.email ?? "" }));
        sb.client
          .from("users")
          .select("full_name,phone")
          .eq("id", data.user.id)
          .maybeSingle()
          .then(({ data: p }) => {
            if (p) {
              setForm((f) => ({
                ...f,
                name: f.name || (p as { full_name: string | null }).full_name || "",
                phone: f.phone || (p as { phone: string | null }).phone || "",
              }));
            }
          });
      }
      setAuthChecked(true);
    });
  }, []);

  const subtotal = lines.reduce(
    (s, l) => s + (hasPrice(l.price) ? Number(l.price) * l.qty : 0),
    0
  );
  const hasUnpriced = lines.some((l) => !hasPrice(l.price));
  const delivery = 0; // Delivery charge: To be confirmed
  const total = subtotal + delivery;

  const input =
    "mt-1 w-full rounded-xl border border-navy/15 px-3 py-3 text-base outline-none focus:border-brand";
  const label = "block text-sm font-medium text-navy/70";

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (sb.state !== "ok" || !userId) {
      setError("Please log in first.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim()) {
      setError("Please fill name, phone and address.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setBusy(true);
    setError(undefined);

    // 1) Save the address
    const { data: addr, error: aErr } = await sb.client
      .from("addresses")
      .insert({
        user_id: userId,
        full_name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim() || null,
        city: form.city.trim() || null,
        state: form.state.trim() || null,
        pincode: form.pincode.trim(),
      })
      .select()
      .single();

    if (aErr) {
      setBusy(false);
      setError(aErr.message);
      return;
    }

    // 2) Save the order
    const { data: order, error: oErr } = await sb.client
      .from("orders")
      .insert({
        user_id: userId,
        status: "placed",
        subtotal,
        delivery_charge: delivery,
        total,
        payment_status: "pending",
        pincode: form.pincode.trim(),
        address_id: (addr as { id: string }).id,
      })
      .select()
      .single();

    if (oErr) {
      setBusy(false);
      setError(oErr.message);
      return;
    }
    const orderId = (order as { id: string }).id;

    // 3) Save the items
    const items = lines.map((l) => ({
      order_id: orderId,
      product_id: l.id,
      product_name: l.name,
      product_code: l.code,
      unit_price: hasPrice(l.price) ? Number(l.price) : 0,
      quantity: l.qty,
      line_total: hasPrice(l.price) ? Number(l.price) * l.qty : 0,
    }));
    const { error: iErr } = await sb.client.from("order_items").insert(items);
    if (iErr) {
      setBusy(false);
      setError(iErr.message);
      return;
    }

    // 4) Payment
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: total }),
      });
      const data = await res.json();

      if (!data.configured) {
        clearCart();
        router.replace(`/order-success?order=${orderId}&pay=later`);
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok) {
        clearCart();
        router.replace(`/order-success?order=${orderId}&pay=failed`);
        return;
      }

      await new Promise<void>((resolve) => {
        const rzp = new (window as unknown as { Razorpay: new (o: unknown) => { open: () => void } }).Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "Panchaloham Jewellery",
          order_id: data.razorpayOrderId,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#5B3DF5" },
          handler: async (response: Record<string, string>) => {
            await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId, ...response }),
            });
            resolve();
          },
          modal: { ondismiss: () => resolve() },
        });
        rzp.open();
      });

      clearCart();
      router.replace(`/order-success?order=${orderId}`);
    } catch {
      clearCart();
      router.replace(`/order-success?order=${orderId}&pay=failed`);
    }
  }

  if (!authChecked) {
    return <section className="mx-auto max-w-3xl px-5 py-16"><p className="text-sm text-navy/50">Loading...</p></section>;
  }

  if (!loggedIn) {
    return (
      <section className="mx-auto max-w-md px-5 py-16">
        <div className="rounded-4xl border border-navy/10 bg-white p-7 text-center shadow-soft">
          <h1 className="font-serif text-2xl text-navy">Please log in to order</h1>
          <p className="mt-2 text-sm text-navy/60">
            You need an account to place an order and to see your order history.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
          <p className="mt-3 text-sm text-navy/60">
            New here?{" "}
            <Link href="/signup" className="font-semibold text-brand">Create an account</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-14">
      <h1 className="font-serif text-3xl text-navy sm:text-4xl">Checkout</h1>

      {ready && lines.length === 0 ? (
        <div className="mt-8 rounded-4xl border border-navy/10 bg-white p-8 text-center">
          <p className="text-navy/70">Your cart is empty.</p>
          <Link href="/" className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white">
            Back to Home
          </Link>
        </div>
      ) : (
        <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="rounded-3xl border border-navy/10 bg-white p-5 sm:p-6">
            <p className="font-serif text-lg text-navy">Delivery details</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Full name *
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
              </label>
              <label className={label}>
                Phone *
                <input inputMode="numeric" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Email (optional)
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Address line 1 *
                <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={input} />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Address line 2
                <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={input} />
              </label>
              <label className={label}>
                City
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={input} />
              </label>
              <label className={label}>
                State
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={input} />
              </label>
              <label className={label}>
                Pincode *
                <input inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={input} />
              </label>
              <label className={`${label} sm:col-span-2`}>
                Notes (optional)
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={input} />
              </label>
            </div>
          </div>

          <div className="rounded-3xl bg-lilac p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start">
            <p className="font-serif text-lg text-navy">Your order</p>

            <ul className="mt-4 space-y-2 text-sm">
              {lines.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate text-navy/80">
                    {l.name} × {l.qty}
                  </span>
                  <span className="shrink-0 text-navy/70">{formatPrice(l.price)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-navy/10 pt-4 text-sm">
              <div className="flex justify-between text-navy/80">
                <span>Items total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-navy/80">
                <span>Delivery</span>
                <span className="text-navy/50">To be confirmed</span>
              </div>
              <div className="flex justify-between font-semibold text-navy">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {hasUnpriced && (
              <p className="mt-3 text-xs text-navy/60">
                Some items show “Price to be confirmed” and are not included in the total. We will
                contact you.
              </p>
            )}

            <p className="mt-3 text-xs text-navy/60">
              Payment: UPI and cards only. Online payment is switched on once the payment gateway
              keys are added.
            </p>

            {error && <p className="mt-3 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="mt-4 w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {busy ? "Placing order..." : "Place order"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
