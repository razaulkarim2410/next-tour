// src/component/AllProducts.jsx
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AllProducts({ category }) {
  await dbConnect();

  const query = category ? { category } : {}; // ✅ Filter if category is passed
  const products = await Product.find(query).lean();

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-center mb-10">
        {category ? `${category} Products` : "Our Top Products"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-11/12 mx-auto">
        {products.length > 0 ? (
          products.map((item) => (
            <Link
              key={item._id.toString()}
              href={`/detail/${item.slug || item._id}`}
              className="flex flex-col rounded-lg overflow-hidden shadow-md relative cursor-pointer bg-white dark:bg-gray-800 transition-shadow duration-300 hover:shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
            >
              {/* Image */}
              <div className="relative w-full h-48">
                <Image
                  src={item.image || "/placeholder.png"}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Info */}
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
    </div>
  );
}
