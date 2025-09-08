// // src/app/detail/[id]/ProductDetail.jsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function ProductDetail({ product }) {
//   const [quantity, setQuantity] = useState(1);
//   const { data: session } = useSession();
//   const router = useRouter();

//   const isLoggedIn = !!session;

//   const handleAddToCart = () => {
//     if (!isLoggedIn) {
//       router.push("/login");
//       return;
//     }
//     console.log("Add to Cart:", { productId: product._id, quantity });
//   };

//   const handleBuyNow = () => {
//     if (!isLoggedIn) {
//       router.push("/login");
//       return;
//     }
//     console.log("Buy Now:", { productId: product._id, quantity });
//   };

//   return (
//     <div className="w-11/12 mx-auto py-10 grid md:grid-cols-2 gap-10">
//       <div className="flex justify-center">
//         <img
//           src={product.image || "/placeholder.png"}
//           alt={product.title}
//           className="w-full max-w-md rounded-lg shadow-lg"
//         />
//       </div>

//       <div>
//         <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
//         <p className="text-orange-600 font-bold text-2xl mb-4">
//           ${product.price}
//         </p>
//         <p className="text-gray-700 mb-4">{product.description}</p>

//         <div className="flex items-center mt-6">
//           <button
//             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//             className="px-3 py-2 bg-gray-200 rounded-l-lg"
//           >
//             -
//           </button>
//           <span className="px-6 py-2 border-t border-b">{quantity}</span>
//           <button
//             onClick={() => setQuantity(quantity + 1)}
//             className="px-3 py-2 bg-gray-200 rounded-r-lg"
//           >
//             +
//           </button>
//         </div>

//         <div className="flex gap-4 mt-6">
//           <button
//             onClick={handleAddToCart}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Add to Cart
//           </button>
//           <button
//             onClick={handleBuyNow}
//             className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Buy Now
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!session) {
      router.push(`/login?redirect=/detail/${product._id}`);
      return;
    }

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity }),
    });

    router.push("/cart");
  };

  const handleBuyNow = async () => {
    if (!session) {
      router.push(`/login?redirect=/detail/${product._id}`);
      return;
    }

    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product._id, quantity }),
    });

    router.push("/cart");
  };

  return (
    <div className="w-11/12 mx-auto py-10 grid md:grid-cols-2 gap-10">
      <div className="flex justify-center">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.title}
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        <p className="text-orange-600 font-bold text-2xl mb-4">${product.price}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>

        <div className="flex items-center mt-6">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 bg-gray-200 rounded-l-lg">-</button>
          <span className="px-6 py-2 border-t border-b">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 bg-gray-200 rounded-r-lg">+</button>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={handleAddToCart} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Cart</button>
          <button onClick={handleBuyNow} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
