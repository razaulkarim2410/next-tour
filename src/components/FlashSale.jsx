"use client";

import { useEffect, useState } from "react";
import FlashSaleCard from "@/components/FlashSaleCard";

export default function FlashSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await fetch("/api/flash-sale", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch flash sale");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("❌ Error fetching flash sale:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  if (loading) return <p className="text-center mt-10">🔥 Loading Flash Sale...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!products.length) return <p className="text-center mt-10">No flash sale products</p>;

  return (
    <section className="w-11/12 mx-auto py-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Flash Sale</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <FlashSaleCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
