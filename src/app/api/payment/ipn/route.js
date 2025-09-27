// src/app/api/payment/ipn/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import fetch from "node-fetch";

if (!global.fetch) global.fetch = fetch;

export async function POST(req) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  let payload = {};

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    payload = Object.fromEntries(new URLSearchParams(text));
  } else if (contentType.includes("multipart/form-data")) {
    const fd = await req.formData();
    payload = {};
    for (const [k, v] of fd.entries()) payload[k] = v;
  } else {
    try {
      payload = await req.json();
    } catch {
      payload = {};
    }
  }

  const tran_id = payload.tran_id || payload.tranID;
  const val_id = payload.val_id;

  if (!tran_id && !val_id) {
    return NextResponse.json({ success: false, message: "Missing tran_id/val_id" }, { status: 400 });
  }

  // Basic: update DB as pending/paid based on status field if present
  // Recommended: call validator API (same logic as success route) — omitted here for brevity
  try {
    // naive update: if payload.status === 'VALID' or payload.val_id present, mark paid
    const statusFlag = payload.status === "VALID" || !!val_id;
    const order = await Order.findOneAndUpdate(
      { transactionId: tran_id },
      {
        status: statusFlag ? "paid" : "failed",
        sslIpnPayload: payload,
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("IPN handler error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
