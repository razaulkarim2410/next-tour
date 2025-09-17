// src/components/ProductCard.jsx
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/detail/${product.slug || product._id}`}
      className="flex flex-col rounded-lg overflow-hidden shadow-md relative cursor-pointer bg-white dark:bg-gray-800 transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="relative w-full h-48">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="p-3 flex flex-col justify-center">
        <h2 className="font-bold text-lg">{product.title}</h2>
        <p className="text-orange-500 font-bold mt-1">${product.price}</p>
        {product.rating && (
          <p className="text-yellow-500 mt-1">
            {"★".repeat(Math.round(product.rating))}{" "}
            {"☆".repeat(5 - Math.round(product.rating))}
          </p>
        )}
      </div>
    </Link>
  );
}
