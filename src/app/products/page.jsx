
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
      const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProducts();
    }
  }, [status]);

  if (status === "loading") return <p className="text-center mt-10">Loading session...</p>;
  if (!session) return null;

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Welcome {session.user.name}</h1>
      <p className="text-gray-600 mb-6">Here are the products:</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

