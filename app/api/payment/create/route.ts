import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Creates a Razorpay order. Returns { configured: false } when keys are not set. */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.includes("[") || keySecret.includes("[")) {
    return NextResponse.json({ configured: false });
  }

  let body: { orderId?: string; amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ configured: true, error: "Bad request" }, { status: 400 });
  }

  const amount = Math.round(Number(body.amount ?? 0) * 100);
  if (!body.orderId || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ configured: true, error: "Nothing to pay" }, { status: 400 });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount, currency: "INR", receipt: body.orderId }),
  });

  if (!res.ok) {
    const t = await res.text();
    return NextResponse.json({ configured: true, error: t }, { status: 500 });
  }

  const order = (await res.json()) as { id: string; amount: number; currency: string };
  return NextResponse.json({
    configured: true,
    keyId,
    razorpayOrderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
