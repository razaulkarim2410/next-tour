// src/app/detail/[id]/page.jsx
import React from "react";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import Image from "next/image";

export default async function DetailPage({ params }) {
  const productsCollection = dbConnect(collectionNameObj.products);
  
  // Fetch single product by ObjectId
  const product = await productsCollection.findOne({ _id: new ObjectId(params.id) });

  if (!product) {
    return (
      <div className="w-10/12 mx-auto my-10 text-center text-red-500">
        ❌ Product not found
      </div>
    );
  }

  return (
    <div className="w-11/12 lg:w-9/12 mx-auto my-16 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image */}
      <div className="flex items-center justify-center bg-white rounded-2xl shadow-lg p-6">
        {product.image ? (
          <Image
            src={product.image}
            width={500}
            height={500}
            alt={product.title}
            className="rounded-xl object-cover"
            unoptimized
          />
        ) : (
          <div className="w-[400px] h-[400px] bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-between bg-white rounded-2xl shadow-lg p-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{product.description}</p>

          <div className="mt-6">
            <p className="text-2xl font-bold text-orange-500">💲{product.price}</p>
            <p className={`mt-2 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `✅ In Stock (${product.stock} left)` : "❌ Out of Stock"}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-gray-700"><span className="font-semibold">Brand:</span> {product.brand}</p>
            <p className="text-gray-700"><span className="font-semibold">Category:</span> {product.category}</p>
          </div>

          <div className="flex items-center mt-6">
            <span className="text-yellow-500 text-xl">⭐</span>
            <span className="ml-2 text-gray-800 font-medium">{product.rating} / 5</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md transition">
            🛒 Add to Cart
          </button>
          <button className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold shadow-md transition">
            ❤️ Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}
