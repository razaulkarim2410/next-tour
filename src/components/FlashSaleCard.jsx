"use client";

import Image from "next/image";
import Link from "next/link";

export default function FlashSaleCard({ product }) {
  const hasDiscount = product.originalPrice && product.price < product.originalPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      href={`/detail/${product.slug || product._id}`}
      className="flex flex-col rounded-lg overflow-hidden shadow-md cursor-pointer bg-white dark:bg-gray-800 transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="relative w-full h-48">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col justify-center">
        <h2 className="font-bold text-lg truncate">{product.title}</h2>

        {/* Price */}
        <p className="text-orange-500 font-bold text-lg mt-1">${product.price}</p>

        {/* Original Price & Discount */}
        {hasDiscount && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <p className="line-through">${product.originalPrice}</p>
            <p className="text-red-600 font-semibold">-{discountPercent}%</p>
          </div>
        )}

        {/* Optional Rating */}
        {product.rating && (
          <p className="text-yellow-500 mt-1">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </p>
        )}
      </div>
    </Link>
  );
}
