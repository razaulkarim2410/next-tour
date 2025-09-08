import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";

export default async function DetailPage({ params }) {
  await dbConnect();

  let product = null;

  // ✅ Check if params.id is a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(params.id)) {
    product = await Product.findById(params.id).lean();
  } else {
    // Otherwise, treat it as a slug
    product = await Product.findOne({ slug: params.id }).lean();
  }

  if (!product) {
    return <p className="text-center mt-20 text-red-500">Product not found</p>;
  }

  return (
    <div className="w-11/12 mx-auto py-10 grid md:grid-cols-2 gap-10">
      {/* Left: Image */}
      <div className="flex justify-center">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </div>

      {/* Right: Product Info */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

        {/* Rating */}
        {product.rating && (
          <p className="text-yellow-500 mb-3 text-lg">
            {"★".repeat(Math.round(product.rating))}{" "}
            {"☆".repeat(5 - Math.round(product.rating))} 
            <span className="text-gray-600 ml-2">
              ({product.rating} / 5)
            </span>
          </p>
        )}

        {/* Price */}
        <p className="text-orange-600 font-bold text-2xl mb-4">
          ${product.price}
        </p>

        {/* Description */}
        <p className="text-gray-700 mb-4">{product.description}</p>

        {/* Extra Info */}
        <div className="space-y-2 text-gray-800">
          <p><span className="font-semibold">Category:</span> {product.category}</p>
          <p><span className="font-semibold">Brand:</span> {product.brand}</p>
          <p>
            <span className="font-semibold">Stock:</span>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600">{product.stock} available</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>
        </div>

        {/* Action Button */}
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
