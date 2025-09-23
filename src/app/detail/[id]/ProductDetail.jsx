"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, ShoppingCart, Zap, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(product.rating || 0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const { fetchCart } = useCart();

  // Fetch reviews and similar products
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${product._id}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();

        setReviews(data.reviews || []);
        setAverageRating(data.calculatedAverage || 0);
      } catch (err) {
        console.error(err);
        setReviews([]);
        setAverageRating(0);
      }
    };

    const fetchSimilarProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${product.category}`);
        if (!res.ok) throw new Error("Failed to fetch similar products");
        const data = await res.json();
        setSimilarProducts(data.filter((p) => p._id !== product._id));
      } catch (err) {
        console.error(err);
        setSimilarProducts([]);
      }
    };

    fetchReviews();
    fetchSimilarProducts();
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

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newReview = {
      productId: product._id,
      userName: session.user.name,
      rating: parseInt(form.rating.value),
      comment: form.comment.value,
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) throw new Error("Failed to submit review");

      const saved = await res.json();
      const updatedReviews = [saved, ...reviews];
      setReviews(updatedReviews);

      // Recalculate average rating dynamically
      const newAverage = (
        updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length
      ).toFixed(1);
      setAverageRating(parseFloat(newAverage));

      toast.success("✅ Review submitted successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to submit review!");
    }
  };

  return (
    <div className="w-11/12 mx-auto py-10">
      {/* Top Section: Product Info */}
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
            <div className="flex">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-5 h-5 ${idx < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}`}
                  fill={idx < Math.round(averageRating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm font-semibold">
              {averageRating}/5 ({reviews.length} {reviews.length === 1 ? "rating" : "ratings"})
            </span>
            <span
              className={`ml-4 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
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
              className="flex items-center justify-center gap-2 px-12 py-3 bg-orange-600 text-white  hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ShoppingCart size={20} />}
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 px-12 py-3 bg-green-600 text-white  hover:bg-green-700 disabled:opacity-50"
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

      {/* ---------- CUSTOMER REVIEWS ---------- */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Existing Reviews */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r._id} className="border p-4 rounded-lg shadow-md bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${idx < r.rating ? "text-yellow-500" : "text-gray-300"}`}
                        fill={idx < r.rating ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="text-gray-600 text-sm font-medium">by {r.userName}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{r.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Review Form (only if logged in) */}
        {session ? (
          <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
            <label className="block">
              <span className="text-gray-700">Rating</span>
              <select name="rating" className="border rounded p-2 w-full" required>
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-gray-700">Comment</span>
              <textarea
                name="comment"
                className="border rounded p-2 w-full"
                placeholder="Write your review..."
                required
              />
            </label>
            <button
              type="submit"
              className="px-8 py-2 bg-orange-600 text-white  hover:bg-orange-700 disabled:opacity-50"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="mt-4 text-gray-500">
            Please{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => router.push(`/login?redirect=/detail/${product._id}`)}
            >
              log in
            </span>{" "}
            to write a review.
          </p>
        )}
      </section>

      {/* ---------- SIMILAR PRODUCTS ---------- */}
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

// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Loader2, Minus, Plus, ShoppingCart, Zap, Star } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import toast from "react-hot-toast";
// import Image from "next/image";

// export default function ProductDetail({ product }) {
//   const [quantity, setQuantity] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [reviews, setReviews] = useState([]);
//   const [averageRating, setAverageRating] = useState(product.rating || 0);
//   const [similarProducts, setSimilarProducts] = useState([]);
//   const { data: session } = useSession();
//   const router = useRouter();
//   const { fetchCart } = useCart();

//   // Fetch reviews and similar products once
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const res = await fetch(`/api/reviews?productId=${product._id}&limit=5`);
//         if (!res.ok) throw new Error("Failed to fetch reviews");
//         const data = await res.json();
//         setReviews(data.reviews || []);

//         // Calculate average rating from reviews
//         const avg =
//           data.reviews && data.reviews.length > 0
//             ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length
//             : product.rating || 0;
//         setAverageRating(parseFloat(avg.toFixed(1)));
//       } catch (err) {
//         console.error(err);
//         setReviews([]);
//         setAverageRating(product.rating || 0);
//       }
//     };

//     const fetchSimilarProducts = async () => {
//       try {
//         const res = await fetch(`/api/products?category=${product.category}&limit=4`);
//         if (!res.ok) throw new Error("Failed to fetch similar products");
//         const data = await res.json();
//         setSimilarProducts(data.filter((p) => p._id !== product._id));
//       } catch (err) {
//         console.error(err);
//         setSimilarProducts([]);
//       }
//     };

//     fetchReviews();
//     fetchSimilarProducts();
//   }, [product]);

//   // Add to cart
//   const handleAddToCart = async () => {
//     if (!session) return router.push(`/login?redirect=/detail/${product._id}`);
//     setLoading(true);
//     try {
//       await fetch("/api/cart", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ productId: product._id, quantity }),
//       });
//       await fetchCart();
//       router.push("/cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBuyNow = () => {
//     if (!session) return router.push(`/login?redirect=/detail/${product._id}`);
//     router.push(`/checkout?productId=${product._id}&qty=${quantity}`);
//   };

//   // Submit review
//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
//     if (!session) return;

//     const form = e.target;
//     const newReview = {
//       productId: product._id,
//       userName: session.user.name,
//       rating: parseInt(form.rating.value),
//       comment: form.comment.value,
//     };

//     try {
//       const res = await fetch("/api/reviews", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newReview),
//       });
//       if (!res.ok) throw new Error("Failed to submit review");
//       const saved = await res.json();

//       const updatedReviews = [saved, ...reviews];
//       setReviews(updatedReviews);

//       // Recalculate average rating
//       const newAvg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
//       setAverageRating(parseFloat(newAvg.toFixed(1)));

//       toast.success("✅ Review submitted successfully!");
//       form.reset();
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to submit review!");
//     }
//   };

//   return (
//     <div className="w-11/12 mx-auto py-10">
//       {/* Top Section: Product Info */}
//       <div className="grid md:grid-cols-2 gap-10">
//         {/* Product Image */}
//         <div className="flex justify-center">
//           <Image
//             src={product.image || "/placeholder.png"}
//             alt={product.title}
//             width={400}
//             height={400}
//             className="w-full max-w-md rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
//           />
//         </div>

//         {/* Product Info */}
//         <div>
//           <h1 className="text-3xl font-bold mb-3">{product.title}</h1>

//           {/* Rating + Stock */}
//           <div className="flex items-center gap-3 mb-4">
//             <div className="flex">
//               {[...Array(5)].map((_, idx) => (
//                 <Star
//                   key={idx}
//                   className={`w-5 h-5 ${idx < Math.round(averageRating) ? "text-yellow-500" : "text-gray-300"}`}
//                   fill={idx < Math.round(averageRating) ? "currentColor" : "none"}
//                 />
//               ))}
//             </div>
//             <span className="text-gray-600 text-sm font-semibold">
//               {averageRating}/5 ({reviews.length} {reviews.length === 1 ? "rating" : "ratings"})
//             </span>
//             <span className={`ml-4 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
//               {product.stock > 0 ? "In Stock" : "Out of Stock"}
//             </span>
//           </div>

//           <p className="text-orange-600 font-bold text-3xl mb-4">${product.price}</p>
//           <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

//           {/* Quantity Selector */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setQuantity(Math.max(1, quantity - 1))}
//               className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//               disabled={quantity <= 1}
//             >
//               <Minus size={18} />
//             </button>
//             <span className="px-6 py-2 border rounded-md">{quantity}</span>
//             <button onClick={() => setQuantity(quantity + 1)} className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
//               <Plus size={18} />
//             </button>
//           </div>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 mt-6">
//             <button
//               onClick={handleAddToCart}
//               disabled={loading || product.stock <= 0}
//               className="flex items-center justify-center gap-2 px-12 py-3 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
//             >
//               {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ShoppingCart size={20} />}
//               Add to Cart
//             </button>

//             <button
//               onClick={handleBuyNow}
//               disabled={product.stock <= 0}
//               className="flex items-center justify-center gap-2 px-12 py-3 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
//             >
//               <Zap size={20} />
//               Buy Now
//             </button>
//           </div>

//           {/* Extra Info */}
//           <div className="mt-8 border-t pt-4 text-sm text-gray-600 space-y-2">
//             <p>✅ Free delivery on orders over $50</p>
//             <p>✅ 7-day return policy</p>
//             <p>✅ Secure payment guaranteed</p>
//           </div>
//         </div>
//       </div>

//       {/* ---------- CUSTOMER REVIEWS ---------- */}
//       <section className="mt-12">
//         <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

//         {/* Existing Reviews */}
//         <div className="space-y-4">
//           {reviews.length > 0 ? (
//             reviews.map((r) => (
//               <div key={r._id} className="border p-4 rounded-lg shadow-md bg-white">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     {[...Array(5)].map((_, idx) => (
//                       <Star
//                         key={idx}
//                         className={`w-4 h-4 ${idx < r.rating ? "text-yellow-500" : "text-gray-300"}`}
//                         fill={idx < r.rating ? "currentColor" : "none"}
//                       />
//                     ))}
//                     <span className="text-gray-600 text-sm font-medium">by {r.userName}</span>
//                   </div>
//                   <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
//                 </div>
//                 <p className="mt-2 text-gray-700">{r.comment}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No reviews yet. Be the first to review!</p>
//           )}
//         </div>

//         {/* Review Form (if logged in) */}
//         {session ? (
//           <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
//             <label className="block">
//               <span className="text-gray-700">Rating</span>
//               <select name="rating" className="border rounded p-2 w-full" required>
//                 <option value="">Select rating</option>
//                 {[1, 2, 3, 4, 5].map((r) => (
//                   <option key={r} value={r}>
//                     {r} Star{r > 1 ? "s" : ""}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <label className="block">
//               <span className="text-gray-700">Comment</span>
//               <textarea name="comment" className="border rounded p-2 w-full" placeholder="Write your review..." required />
//             </label>
//             <button type="submit" className="px-8 py-2 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50">
//               Submit Review
//             </button>
//           </form>
//         ) : (
//           <p className="mt-4 text-gray-500">
//             Please{" "}
//             <span
//               className="text-blue-600 cursor-pointer underline"
//               onClick={() => router.push(`/login?redirect=/detail/${product._id}`)}
//             >
//               log in
//             </span>{" "}
//             to write a review.
//           </p>
//         )}
//       </section>

//       {/* Similar Products */}
//       <section className="mt-16">
//         <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {similarProducts.map((p) => (
//             <div
//               key={p._id}
//               className="border rounded-xl shadow-sm hover:shadow-md p-4 transition cursor-pointer"
//               onClick={() => router.push(`/detail/${p._id}`)}
//             >
//               <Image
//                 src={p.image || "/placeholder.png"}
//                 width={300}
//                 height={300}
//                 alt={p.title}
//                 className="w-full h-48 object-cover rounded-lg mb-3"
//               />
//               <h3 className="font-semibold">{p.title}</h3>
//               <p className="text-orange-600 font-bold">${p.price}</p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
