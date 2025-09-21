"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const INITIAL_COUNT = 18;
const LOAD_MORE_COUNT = 12;

export default function AllProductsClient({ products = [], category }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="py-10">
      <h1 className="text-3xl font-xl w-11/12 mx-auto  mb-10">
        {category ? `${category} Products` : "Our Top Products"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-11/12 mx-auto">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((item) => (
            <Link
              key={item._id?.toString()}
              href={`/detail/${item.slug || item._id}`}
              className="flex flex-col rounded-lg overflow-hidden shadow-md relative cursor-pointer bg-white dark:bg-gray-800 transition-shadow duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="p-3 flex flex-col justify-center">
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="text-orange-500 font-bold mt-1">${item.price}</p>
                {item.rating && (
                  <p className="text-yellow-500 mt-1">
                    {"★".repeat(Math.round(item.rating))}{" "}
                    {"☆".repeat(5 - Math.round(item.rating))}
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found in this category.
          </p>
        )}
      </div>

      {visibleCount < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-26 py-3 bg-orange-600 text-white font-semibold  hover:bg-orange-700 transition"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
