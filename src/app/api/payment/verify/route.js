import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req) {
  await dbConnect();

  try {
    const { orderId, paymentId, amount, status } = await req.json();

    if (!orderId || !paymentId || !amount || !status) {
      return NextResponse.json(
        { error: "Missing payment verification details" },
        { status: 400 }
      );
    }

    // Fetch order from DB
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify payment details (example: amount match)
    if (order.total !== amount) {
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 400 }
      );
    }

    // Update order as paid
    order.status = status === "success" ? "paid" : "failed";
    order.paymentId = paymentId;
    await order.save();

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed", details: error.message },
      { status: 500 }
    );
  }
}
