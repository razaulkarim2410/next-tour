import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.description || !data.price) {
      return NextResponse.json(
        { error: "Title, description and price are required." },
        { status: 400 }
      );
    }

    // Prepare payload
    const payload = {
      title: data.title,
      description: data.description,
      price: Number(data.price),
      image: data.image || "/placeholder.png",
      category: data.category || "General",
      brand: data.brand || "",
      stock: Number(data.stock || 0),
      rating: Number(data.rating || 0),
      slug: data.title
        ? data.title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
        : undefined,
    };

    const newProduct = await Product.create(payload);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("Add Product Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to add product" },
      { status: 500 }
    );
  }
}
