// import { NextResponse } from "next/server";
// import  dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product"; // adjust path

// export async function GET(req, { params }) {
//   await dbConnect();
//   try {
//     const product = await Product.findById(params.id);
//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }
//     return NextResponse.json(product);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server"; 
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { id } = context.params; // ✅ use params from context
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 400 }
    );
  }
}
