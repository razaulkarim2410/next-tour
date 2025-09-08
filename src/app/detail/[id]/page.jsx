// src/app/detail/[id]/page.jsx
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";
import ProductDetail from "./ProductDetail";

export default async function DetailPage({ params }) {
  const { id } = await params; // ✅ await params here
  await dbConnect();

  let product = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).lean();
  } else {
    product = await Product.findOne({ slug: id }).lean();
  }

  if (!product) {
    return <p className="text-center mt-20 text-red-500">Product not found</p>;
  }

  product._id = product._id.toString();

  return <ProductDetail product={product} />;
}
