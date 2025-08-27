"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    product_id: "",
    image: "",
    title: "",
    price: "",
    description: "",
    rating: "",
    category: "",
    brand: "",
    stock: "",
  });

  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) toast.error(res.error || "Invalid email or password");
    setLoginLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("✅ Product added successfully!");
        setFormData({
          product_id: "",
          image: "",
          title: "",
          price: "",
          description: "",
          rating: "",
          category: "",
          brand: "",
          stock: "",
        });
      } else {
        toast.error("❌ Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error submitting form");
    }
  };

  if (status === "loading") return <div className="text-center mt-10">Loading...</div>;

  // Show login form if not authenticated
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold">Login to continue</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-72">
          <input type="email" name="email" placeholder="Email" className="p-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" className="p-2 border rounded" required />
          <button
            type="submit"
            disabled={loginLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    );
  }

  // Show Add Product form if authenticated
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="number" name="product_id" value={formData.product_id} onChange={handleChange} placeholder="Product ID" className="p-2 border rounded" required />
        <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" required />
        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="p-2 border rounded" required />
        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" required />
        <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" className="p-2 border rounded" required />
        <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="p-2 border rounded" required />
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" className="p-2 border rounded" required />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" className="p-2 border rounded" required />
        <button type="submit" className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700">Add Product</button>
      </form>
    </div>
  );
}
