// src/components/CategoryDetailsPage.jsx
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

export default function CategoryDetailsPage({ slug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${slug}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  if (!products.length)
    return <p className="text-center mt-10">No products found in {slug}</p>;

  return (
    <div className="w-11/12 mx-auto py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
