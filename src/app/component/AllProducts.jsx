// src/app/component/AllProducts.jsx
import React from "react";
import dbConnect, { collectionNameObj } from "@/lib/dbConnect";
import Image from "next/image";
import Link from "next/link";

export default async function AllProducts() {
  // Get the products collection
  const productsCollection = dbConnect(collectionNameObj.products);

  // Fetch all products
  const products = await productsCollection.find({}).toArray();

  return (
    <div>
      <h1 className="text-3xl font-bold text-center pt-10 mb-4">Our Top Products</h1>
    <div className="grid grid-cols-15 w-11/12 mx-auto my-10 gap-3 ">
      
      {products.map((item) => (
        <div
          className="col-span-15 md:col-span-5 lg:col-span-3 p-3 h-full border border-orange-500 gap-3"
          key={item._id.toString()}
        >
          {/* <figure>
            <Image
              src={item.image || "/placeholder.png"}
              width={250}
              height={300}
              alt={item.title}
              unoptimized
            />
          </figure> */}
          <figure className="w-full flex justify-center">
            {/* Mobile: full width, auto height */}
            <div className="block md:hidden w-full">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.title}
                width={500}
                height={300}
                className="w-full h-auto object-contain"
                unoptimized
              />
            </div>

            {/* Desktop: fixed aspect ratio for consistency */}
            <div className="hidden md:block relative w-full aspect-[16/9]">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.title}
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
            </div>
          </figure>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-end justify-between w-full">
              <div>
                <h2 className="font-bold text-xl">{item.title}</h2>
                <p className="font-bold text-xl text-orange-500">
                  Price: ${item.price}
                </p>
              </div>
              <Link className="btn btn-xs font-bold hover:text-white text-orange-500 bg-white hover:bg-orange-700  " href={`/detail/${item._id.toString()}`}>Detail</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
