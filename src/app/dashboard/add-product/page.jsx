// "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { toast, Toaster } from "react-hot-toast";

// export default function AddProductPage() {
//   const { data: session, status } = useSession();

//   const [formData, setFormData] = useState({
//     image: "",
//     title: "",
//     price: "",
//     description: "",
//     rating: "",
//     category: "",
//     brand: "",
//     stock: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       price: Number(formData.price),
//       rating: Number(formData.rating || 0),
//       stock: Number(formData.stock || 0),
//     };

//     try {
//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         toast.success("✅ Product added successfully!");
//         setFormData({
//           image: "",
//           title: "",
//           price: "",
//           description: "",
//           rating: "",
//           category: "",
//           brand: "",
//           stock: "",
//         });
//       } else {
//         const err = await res.json();
//         toast.error(err?.error || "❌ Failed to add product");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Error submitting form");
//     }
//   };

//   if (status === "loading")
//     return <div className="text-center mt-10">Loading...</div>;

//   if (!session)
//     return (
//       <div className="flex flex-col items-center justify-center h-screen gap-6">
//         <Toaster position="top-right" />
//         <h1 className="text-3xl font-bold">Login to continue</h1>
//       </div>
//     );

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-gray-50 text-black shadow rounded">
//       <Toaster position="top-right" />
//       <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//         {[
//           { name: "image", type: "text", placeholder: "Image URL" },
//           { name: "title", type: "text", placeholder: "Title" },
//           { name: "price", type: "number", step: "0.01", placeholder: "Price" },
//           { name: "description", type: "textarea", placeholder: "Description" },
//           { name: "rating", type: "number", step: "0.1", placeholder: "Rating" },
//           { name: "category", type: "text", placeholder: "Category" },
//           { name: "brand", type: "text", placeholder: "Brand" },
//           { name: "stock", type: "number", placeholder: "Stock" },
//         ].map((field) =>
//           field.type === "textarea" ? (
//             <textarea
//               key={field.name}
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               className="p-2 border rounded"
//               required={field.name !== "rating" && field.name !== "brand"}
//             />
//           ) : (
//             <input
//               key={field.name}
//               type={field.type}
//               step={field.step}
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               className="p-2 border rounded"
//               required={field.name !== "rating" && field.name !== "brand"}
//             />
//           )
//         )}
//         <button
//           type="submit"
//           className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
//         >
//           Add Product
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast, Toaster } from "react-hot-toast";

export default function AddProductPage() {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    image: "",
    title: "",
    price: "",
    originalPrice: "", // ✅ NEW
    description: "",
    rating: "",
    category: "",
    brand: "",
    stock: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice
        ? Number(formData.originalPrice)
        : null, // ✅ save discount if available
      rating: Number(formData.rating || 0),
      stock: Number(formData.stock || 0),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("✅ Product added successfully!");
        setFormData({
          image: "",
          title: "",
          price: "",
          originalPrice: "",
          description: "",
          rating: "",
          category: "",
          brand: "",
          stock: "",
        });
      } else {
        const err = await res.json();
        toast.error(err?.error || "❌ Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error submitting form");
    }
  };

  if (status === "loading")
    return <div className="text-center mt-10">Loading...</div>;

  if (!session)
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <Toaster position="top-right" />
        <h1 className="text-3xl font-bold">Login to continue</h1>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 text-black shadow rounded">
      <Toaster position="top-right" />
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {[
          { name: "image", type: "text", placeholder: "Image URL" },
          { name: "title", type: "text", placeholder: "Title" },
          { name: "price", type: "number", step: "0.01", placeholder: "Price" },
          {
            name: "originalPrice",
            type: "number",
            step: "0.01",
            placeholder: "Original Price (if discounted)",
          },
          { name: "description", type: "textarea", placeholder: "Description" },
          { name: "rating", type: "number", step: "0.1", placeholder: "Rating" },
          { name: "category", type: "text", placeholder: "Category" },
          { name: "brand", type: "text", placeholder: "Brand" },
          { name: "stock", type: "number", placeholder: "Stock" },
        ].map((field) =>
          field.type === "textarea" ? (
            <textarea
              key={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="p-2 border rounded"
              required={field.name !== "rating" && field.name !== "brand"}
            />
          ) : (
            <input
              key={field.name}
              type={field.type}
              step={field.step}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="p-2 border rounded"
              required={
                field.name !== "rating" &&
                field.name !== "brand" &&
                field.name !== "originalPrice" // ✅ discount not required
              }
            />
          )
        )}
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

