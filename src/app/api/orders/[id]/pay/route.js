// src/app/api/orders/[id]/pay/route.js
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { method } = await req.json();

    // ✅ Ensure params is used correctly
    const { id } = params;

    const order = await Order.findByIdAndUpdate(
      id,
      { status: "paid", paymentMethod: method },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Order payment update error:", error);
    return NextResponse.json(
      { error: "Failed to update order", details: error.message },
      { status: 500 }
    );
  }
}
