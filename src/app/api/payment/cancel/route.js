import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();
  const tran_id = formData.get("tran_id");

  try {
    const order = await Order.findOne({ transactionId: tran_id });
    if (order) {
      await Order.findByIdAndUpdate(order._id, { status: "cancelled" });
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-cancel?orderId=${order._id}`);
    }

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-cancel`);
  } catch (err) {
    console.error("Payment cancel route error:", err);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-cancel`);
  }
}
