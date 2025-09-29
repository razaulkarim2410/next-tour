import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

let Product;
try {
  Product = mongoose.model("Product");
} catch {
  Product = require("@/models/Product").default;
}

export async function GET(req) {
  try {
    await dbConnect();

    const discountedProducts = await Product.find({
      originalPrice: { $exists: true, $gt: 0 },
      $expr: { $gt: ["$originalPrice", "$price"] },
    });

    return new Response(JSON.stringify(discountedProducts), { status: 200 });
  } catch (err) {
    console.error("❌ Flash sale API error:", err); // 👈 Log the actual server error
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
  }
}
