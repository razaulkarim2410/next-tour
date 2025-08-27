"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); // redirects to /login automatically
    }
  }, [status]);

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

  // Show loading while session is being checked
  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Only render form if session exists
  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* ... your input fields ... */}
        <input
          type="number"
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          placeholder="Product ID"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.1"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rating"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
