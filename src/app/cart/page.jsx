"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, Trash2 } from "lucide-react"; // ✅ nice icons

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [voucher, setVoucher] = useState("");
  const [loading, setLoading] = useState(true);
  const [wishlistModal, setWishlistModal] = useState(null); // product id or null
  const [deleteModal, setDeleteModal] = useState(null); // product id or null
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", {
        method: "GET",            // ✅ explicitly set GET method
        credentials: "include",   // ✅ crucial in production for sending session cookie
      });
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
      setCart((prev) =>
        prev.map((i) =>
          i.product._id === id ? { ...i, quantity: qty } : i
        )
      ); // ✅ Optimistic UI

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ crucial in production
        body: JSON.stringify({
          productId: id,
          quantity: qty - cart.find((i) => i.product._id === id).quantity,
        }),
      });

      if (!res.ok) throw new Error("Failed to update cart");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Update cart error:", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      setCart((prev) => prev.filter((i) => i.product._id !== id)); // ✅ Optimistic remove

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ crucial in production
        body: JSON.stringify({ productId: id }),
      });

      if (!res.ok) throw new Error("Failed to remove item");
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Remove item error:", err);
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

  if (loading) {
    return <p className="text-center mt-10">Loading cart...</p>;
  }

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
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm relative"
          >
            <img
              src={product.image}
              className="w-24 h-24 object-cover rounded"
              alt={product.title}
            />
            <div className="flex-1">
              <h2 className="font-semibold">{product.title}</h2>
              <p className="text-gray-600">$ {product.price.toFixed(2)}</p>

              {/* ✅ Extra product info */}
              <div className="text-sm text-gray-500 mt-1 space-y-1">
                <p><span className="font-medium">Brand:</span> {product.brand}</p>
                <p><span className="font-medium">Category:</span> {product.category}</p>
                <p>
                  <span className="font-medium">Stock:</span>{" "}
                  {product.stock > 0 ? (
                    <span className="text-green-600">{product.stock} available</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              </div>

              {/* Quantity buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => updateQty(product._id, Math.max(1, quantity - 1))}
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



            {/* Action Icons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setWishlistModal(product._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Heart />
              </button>
              <button
                onClick={() => setDeleteModal(product._id)}
                className="text-gray-600 hover:text-black"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Order Summary */}
      <div className="p-6 border rounded-lg shadow-md bg-white h-fit">
        <h2 className="text-lg font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Subtotal ({cart.length} items)</span>
          <span>$ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>Shipping Fee</span>
          <span>$ {shipping.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount</span>
            <span>-$ {discount.toFixed(2)}</span>
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
          <span>$ {total.toFixed(2)}</span>
        </div>

        <button
          onClick={handlePay}
          className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
        >
          PROCEED TO CHECKOUT ({cart.length})
        </button>
      </div>

      {/* Wishlist Modal */}
      {wishlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setWishlistModal(null)}
            >
              <X />
            </button>
            <h3 className="text-lg font-bold mb-4">Move To Wishlist</h3>
            <p className="text-gray-600 mb-6">
              Item(s) will be moved to wishlist and removed from cart.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setWishlistModal(null)}
                className="px-4 py-2 border rounded"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  alert("Moved to wishlist!");
                  setWishlistModal(null);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                MOVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setDeleteModal(null)}
            >
              <X />
            </button>
            <h3 className="text-lg font-bold mb-4">Remove from Cart</h3>
            <p className="text-gray-600 mb-6">
              Item(s) will be removed from order.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border rounded"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  removeFromCart(deleteModal);
                  setDeleteModal(null);
                }}
                className="px-4 py-2 bg-black text-white rounded"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
