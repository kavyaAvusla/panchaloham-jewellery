import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * Server-side payment confirmation.
 * Verifies the Razorpay signature and only then marks the order as paid.
 * Uses the service role key (server only) because orders can be updated
 * by admin/service roles, never by the customer's browser.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret || !url || !service) {
    return NextResponse.json(
      { ok: false, error: "Payment is not configured yet (missing keys)." },
      { status: 500 }
    );
  }

  let body: {
    orderId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ ok: false, error: "Missing payment fields" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ ok: false, error: "Signature check failed" }, { status: 400 });
  }

  const admin = createClient(url, service, { auth: { persistSession: false } });

  const { error: uErr } = await admin
    .from("orders")
    .update({ payment_status: "paid" })
    .eq("id", orderId);
  if (uErr) {
    return NextResponse.json({ ok: false, error: uErr.message }, { status: 500 });
  }

  await admin.from("payments").insert({
    order_id: orderId,
    gateway: "razorpay",
    gateway_ref: razorpay_payment_id,
    amount: 0,
    status: "success",
  });

  return NextResponse.json({ ok: true });
}
