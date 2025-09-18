export const dynamic = "force-dynamic"; // ✅ prevent caching

import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let query = {};
    if (category) query.category = new RegExp(`^${escapeRegex(category)}$`, "i");

    const products = await Product.find(query).lean();

    const normalized = products.map((p) => ({
      _id: p._id,
      title: p.title || `Product ${p.product_id || ""}`,
      price: Number(p.price) || 0,
      image: p.image || "/placeholder.png",
      category: p.category || "Others",
      slug:
        p.slug ||
        (p.title
          ? p.title.replace(/\s+/g, "-").toLowerCase()
          : `product-${p._id}`),
      rating: Number(p.rating) || 0,
      stock: Number(p.stock) || 0,
      brand: p.brand || "Unknown",
      description: p.description || "",
    }));

    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching products:", error.message, error.stack);
    return NextResponse.json(
      { message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();

    if (!data.title || !data.price) {
      return NextResponse.json(
        { message: "Title and Price are required" },
        { status: 400 }
      );
    }

    const slug =
      data.slug || data.title.replace(/\s+/g, "-").toLowerCase();

    const newProduct = await Product.create({ ...data, slug });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding product:", error.message, error.stack);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
