// // src/app/detail/[id]/page.jsx
// import dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product";
// import mongoose from "mongoose";
// import ProductDetail from "./ProductDetail";

// export default async function DetailPage({ params }) {
//   const { id } = await params; // ✅ await params here
//   await dbConnect();

//   let product = null;
//   if (mongoose.Types.ObjectId.isValid(id)) {
//     product = await Product.findById(id).lean();
//   } else {
//     product = await Product.findOne({ slug: id }).lean();
//   }

//   if (!product) {
//     return <p className="text-center mt-20 text-red-500">Product not found</p>;
//   }

//   product._id = product._id.toString();

//   return <ProductDetail product={product} />;
// }


// src/app/detail/[id]/page.jsx
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Review from "@/models/Review";
import mongoose from "mongoose";
import ProductDetail from "./ProductDetail";

export default async function DetailPage({ params }) {
  const { id } = params;
  await dbConnect();

  // Fetch product by ObjectId or slug
  let product = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id).lean();
  } else {
    product = await Product.findOne({ slug: id }).lean();
  }

  if (!product) {
    return <p className="text-center mt-20 text-red-500">Product not found</p>;
  }

  // Fetch reviews for this product
  const reviewsData = await Review.find({ productId: product._id }).sort({ createdAt: -1 }).lean();

  // Pre-fetch similar products (same category, exclude current product)
  const similarProductsData = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  })
    .limit(8)
    .lean();

  // Serialize all MongoDB ObjectIds and Dates
  const serializeProduct = {
    ...product,
    _id: product._id.toString(),
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  };

  const serializeReviews = reviewsData.map((r) => ({
    ...r,
    _id: r._id.toString(),
    productId: r.productId?.toString(),
    createdAt: r.createdAt?.toISOString(),
    updatedAt: r.updatedAt?.toISOString(),
  }));

  const serializeSimilarProducts = similarProductsData.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  // Calculate average rating
  const averageRating =
    serializeReviews.length > 0
      ? serializeReviews.reduce((acc, r) => acc + r.rating, 0) / serializeReviews.length
      : product.rating || 0;

  return (
    <ProductDetail
      product={serializeProduct}
      reviews={serializeReviews}
      averageRating={averageRating}
      similarProducts={serializeSimilarProducts}
    />
  );
}
