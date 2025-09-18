

// "use client";

// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Loader2, Minus, Plus, ShoppingCart, Zap } from "lucide-react";
// import { useCart } from "@/context/CartContext"; // ✅ import cart context

// export default function ProductDetail({ product }) {
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { fetchCart } = useCart(); // ✅ access fetchCart from context

//   const handleAddToCart = async () => {
//     if (!session) {
//       router.push(`/login?redirect=/detail/${product._id}`);
//       return;
//     }

//     setLoading(true);
//     try {
//       await fetch("/api/cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId: product._id, quantity }),
//       });

//       await fetchCart(); // ✅ refresh cart immediately
//       router.push("/cart"); // optional redirect
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuyNow = () => {
//     if (!session) {
//       router.push(`/login?redirect=/detail/${product._id}`);
//       return;
//     }
//     router.push(`/checkout?productId=${product._id}&qty=${quantity}`);
//   };

//   return (
//     <div className="w-11/12 mx-auto py-10 grid md:grid-cols-2 gap-10">
//       {/* Product Image */}
//       <div className="flex justify-center">
//         <div className="relative group">
//           <img
//             src={product.image || "/placeholder.png"}
//             alt={product.title}
//             className="w-full max-w-md rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
//           />
//         </div>
//       </div>

//       {/* Product Info */}
//       <div>
//         <h1 className="text-3xl font-bold mb-3">{product.title}</h1>

//         {/* Rating + Stock */}
//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex text-yellow-500">
//             {"★".repeat(product.rating || 4)}{"☆".repeat(5 - (product.rating || 4))}
//           </div>
//           <span className="text-gray-500 text-sm">
//             ({product.reviews || 24} reviews)
//           </span>
//           <span
//             className={`ml-4 text-sm font-medium ${
//               product.stock > 0 ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {product.stock > 0 ? "In Stock" : "Out of Stock"}
//           </span>
//         </div>

//         <p className="text-orange-600 font-bold text-3xl mb-4">${product.price}</p>
//         <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

//         {/* Quantity Selector */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//             className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//             disabled={quantity <= 1}
//           >
//             <Minus size={18} />
//           </button>
//           <span className="px-6 py-2 border rounded-md">{quantity}</span>
//           <button
//             onClick={() => setQuantity(quantity + 1)}
//             className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//           >
//             <Plus size={18} />
//           </button>
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 mt-6">
//           <button
//             onClick={handleAddToCart}
//             disabled={loading || product.stock <= 0}
//             className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ShoppingCart size={20} />}
//             Add to Cart
//           </button>

//           <button
//             onClick={handleBuyNow}
//             disabled={product.stock <= 0}
//             className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//           >
//             <Zap size={20} />
//             Buy Now
//           </button>
//         </div>

//         {/* Extra Info */}
//         <div className="mt-8 border-t pt-4 text-sm text-gray-600 space-y-2">
//           <p>✅ Free delivery on orders over $50</p>
//           <p>✅ 7-day return policy</p>
//           <p>✅ Secure payment guaranteed</p>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingCart, Zap, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { fetchCart } = useCart();

  useEffect(() => {
    // ✅ Fetch reviews
    fetch(`/api/reviews?productId=${product._id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data || []));

    // ✅ Fetch similar category products
    fetch(`/api/products?category=${product.category}`)
      .then((res) => res.json())
      .then((data) => setSimilarProducts(data.filter((p) => p._id !== product._id)));
  }, [product]);

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/login?redirect=/detail/${product._id}`);
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      await fetchCart();
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!session) {
      router.push(`/login?redirect=/detail/${product._id}`);
      return;
    }
    router.push(`/checkout?productId=${product._id}&qty=${quantity}`);
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      {/* ---------- TOP SECTION: PRODUCT DETAIL ---------- */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.title}
            className="w-full max-w-md rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.title}</h1>

          {/* Rating + Stock */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-yellow-500">
              {"★".repeat(product.rating || 4)}{"☆".repeat(5 - (product.rating || 4))}
            </div>
            <span className="text-gray-500 text-sm">
              ({product.reviews || reviews.length} reviews)
            </span>
            <span
              className={`ml-4 text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <p className="text-orange-600 font-bold text-3xl mb-4">${product.price}</p>
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              disabled={quantity <= 1}
            >
              <Minus size={18} />
            </button>
            <span className="px-6 py-2 border rounded-md">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock <= 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ShoppingCart size={20} />}
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Zap size={20} />
              Buy Now
            </button>
          </div>

          {/* Extra Info */}
          <div className="mt-8 border-t pt-4 text-sm text-gray-600 space-y-2">
            <p>✅ Free delivery on orders over $50</p>
            <p>✅ 7-day return policy</p>
            <p>✅ Secure payment guaranteed</p>
          </div>
        </div>
      </div>

      {/* ---------- MIDDLE SECTION: CUSTOMER REVIEWS ---------- */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((r, i) => (
              <div key={i} className="border p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < r.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill={idx < r.rating ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="text-gray-600 text-sm">by {r.userName}</span>
                </div>
                <p className="mt-2 text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
        </div>
      </section>

      {/* ---------- BOTTOM SECTION: YOU MAY ALSO LIKE ---------- */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {similarProducts.slice(0, 4).map((p) => (
            <div
              key={p._id}
              className="border rounded-xl shadow-sm hover:shadow-md p-4 transition cursor-pointer"
              onClick={() => router.push(`/detail/${p._id}`)}
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-orange-600 font-bold">${p.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
