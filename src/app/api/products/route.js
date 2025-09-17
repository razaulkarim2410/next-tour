// import dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     await dbConnect();
//     const data = await req.json();

//     // Validate required fields
//     if (!data.title || !data.description || !data.price) {
//       return NextResponse.json(
//         { error: "Title, description and price are required." },
//         { status: 400 }
//       );
//     }

//     // Prepare payload
//     const payload = {
//       title: data.title,
//       description: data.description,
//       price: Number(data.price),
//       image: data.image || "/placeholder.png",
//       category: data.category || "General",
//       brand: data.brand || "",
//       stock: Number(data.stock || 0),
//       rating: Number(data.rating || 0),
//       slug: data.title
//         ? data.title
//             .toLowerCase()
//             .trim()
//             .replace(/\s+/g, "-")
//             .replace(/[^\w-]+/g, "")
//         : undefined,
//     };

//     const newProduct = await Product.create(payload);
//     return NextResponse.json(newProduct, { status: 201 });
//   } catch (err) {
//     console.error("Add Product Error:", err);
//     return NextResponse.json(
//       { error: err.message || "Failed to add product" },
//       { status: 500 }
//     );
//   }
// }

import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Get search params (for category filter)
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // Fetch all products (or filter by category if provided)
    let query = {};
    if (category) query.category = new RegExp(`^${category}$`, "i"); // case-insensitive match
    const products = await Product.find(query).lean();

    // Normalize data so frontend never breaks
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
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// OPTIONAL: Prevent other methods like POST/PUT/DELETE from throwing 405
export async function POST() {
  return NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405 }
  );
}
