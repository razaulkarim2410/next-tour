"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [voucher, setVoucher] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(data.items || []);
      } catch (err) {
        console.error(err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

 const updateQty = async (id, qty) => {
  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: id,
        quantity: qty - cart.find((i) => i.product._id === id).quantity,
      }),
    });

    if (!res.ok) throw new Error("Failed to update cart");

    const data = await res.json();
    setCart(data.items || []); // ✅ fallback to [] instead of undefined
  } catch (err) {
    console.error("Update cart error:", err);
  }
};


  const subtotal = Array.isArray(cart)
    ? cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    : 0;

 const shipping = Array.isArray(cart) && cart.length > 0 ? 135 : 0;

  const discount = voucher === "DISCOUNT50" ? 50 : 0;
  const total = subtotal + shipping - discount;

  const handlePay = () => {
    router.push("/checkout");
  };

  // 🔹 Loading skeleton
  if (loading) {
    return (
      <div className="w-11/12 mx-auto py-10 grid md:grid-cols-3 gap-8 animate-pulse">
        <div className="md:col-span-2 space-y-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
            >
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border rounded-lg shadow-md bg-white h-fit space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

 // 🔹 Empty cart
if (!Array.isArray(cart) || cart.length === 0) {
  return <p className="text-center mt-10">Cart is empty</p>;
}


  return (
    <div className="w-11/12 mx-auto py-10 grid md:grid-cols-3 gap-8">
      {/* Left: Cart Items */}
      <div className="md:col-span-2 space-y-6">
        {cart.map(({ product, quantity }) => (
          <div
            key={product._id}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm"
          >
            <img
              src={product.image}
              className="w-24 h-24 object-cover rounded"
              alt={product.title}
            />
            <div className="flex-1">
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-gray-600">$ {product.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() =>
                    updateQty(product._id, Math.max(1, quantity - 1))
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => updateQty(product._id, quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Order Summary */}
      <div className="p-6 border rounded-lg shadow-md bg-white h-fit">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Subtotal ({cart.length} items)</span>
          <span>$ {subtotal}</span>
        </div>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Shipping Fee</span>
          <span>$ {shipping}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount</span>
            <span>-$ {discount}</span>
          </div>
        )}

        {/* Voucher Input */}
        <div className="flex gap-2 my-3">
          <input
            type="text"
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            placeholder="Enter Voucher Code"
            className="flex-1 border px-3 py-2 rounded"
          />
          <button
            onClick={() => alert("Voucher applied!")}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            APPLY
          </button>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total</span>
          <span>$ {total}</span>
        </div>

        <button
          onClick={handlePay}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
        >
          PROCEED TO CHECKOUT ({cart.length})
        </button>
      </div>
    </div>
  );
}
