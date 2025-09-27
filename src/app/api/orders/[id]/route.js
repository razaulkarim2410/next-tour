// src/app/api/orders/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(_req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Order fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
