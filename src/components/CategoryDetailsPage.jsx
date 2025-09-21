

"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";

const INITIAL_COUNT = 18;
const LOAD_MORE_COUNT = 12;

export default function CategoryDetailsPage({ slug }) {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/products?category=${slug}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
        setVisibleCount(INITIAL_COUNT); // reset visible count when slug changes
      } catch (err) {
        console.error("❌ Error fetching products:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const visibleProducts = products.slice(0, visibleCount);

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!products.length)
    return <p className="text-center mt-10">No products found in {slug}</p>;

  return (
    <div className="w-11/12 mx-auto py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {visibleCount < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-3 bg-orange-600 text-white font-semibold hover:bg-orange-700 disabled:opacity-50"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
