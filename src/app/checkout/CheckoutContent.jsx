"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState("");

  // 🔹 Shipping info state
  const [shippingInfo, setShippingInfo] = useState({
    name: "Razaul Karim",
    phone: "017XXXXXXXX",
    address: "purbadhala bazar, Purbadhola Saddar, Netrokona, Mymensingh",
  });

  // 🔹 Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const params = useSearchParams();

  const productId = params.get("productId");
  const qty = parseInt(params.get("qty")) || 1;

  // 🔹 Fetch items (cart or single product)
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const res = await fetch(`/api/products/${productId}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const product = await res.json();
          setItems([{ product, quantity: qty }]);
        } else {
          const res = await fetch("/api/cart");
          if (!res.ok) throw new Error("Failed to fetch cart");
          const data = await res.json();
          setItems(data.items || []);
        }
      } catch (err) {
        console.error(err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, qty]);

  // 🔹 Totals
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const discount = voucher === "DISCOUNT50" ? 50 : 0;
  const total = subtotal + shipping - discount;

  // 🔹 Save Order & Redirect
  const handleProceed = async () => {
    try {
      const orderData = {
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.title,
          price: i.product.price,
          quantity: i.quantity,
        })),
        subtotal,
        shipping,
        discount,
        total,
        customer: shippingInfo,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to save order");

      const newOrder = await res.json();
      router.push(`/checkout/payment/${newOrder._id}`);
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading checkout...</p>;

  return (
    <div className="w-11/12 mx-auto py-10 grid md:grid-cols-3 gap-8">
      {/* LEFT: Shipping + Products */}
      <div className="md:col-span-2 space-y-6">
        {/* Shipping & Billing */}
        <div className="p-6 border rounded-lg shadow-md bg-white flex justify-between">
          <div>
            <h2 className="text-lg font-bold mb-2">Shipping & Billing</h2>
            <p className="text-gray-700">
              <span className="font-semibold">{shippingInfo.name}</span><br />
              {shippingInfo.phone}<br />
              {shippingInfo.address}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </button>
        </div>

        {/* Products */}
        {items.map(({ product, quantity }) => (
          <div
            key={product._id}
            className="p-6 border rounded-lg shadow-md bg-white flex gap-6"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <p className="text-sm text-gray-500">Brand: {product.brand}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <p className="font-semibold">Qty</p>
              <p className="text-gray-700">{quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Summary */}
      <div className="p-6 border rounded-lg shadow-md bg-white h-fit space-y-6">
        {/* Promotion */}
        <div>
          <h2 className="font-bold mb-2">Promotion</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              placeholder="Enter Store/NextTour Code"
              className="flex-1 border rounded px-3 py-2"
            />
            <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900">
              APPLY
            </button>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-lg font-bold mb-3">Order Summary</h2>
          <div className="flex justify-between mb-1 text-gray-700">
            <span>Items Total</span>
            <span>$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1 text-gray-700">
            <span>Delivery Fee</span>
            <span>{shipping === 0 ? "FREE" : `$ ${shipping.toFixed(2)}`}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-1 text-green-600">
              <span>Discount</span>
              <span>- $ {discount.toFixed(2)}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold mb-2">
            <span>Total</span>
            <span>$ {total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleProceed}
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition"
          >
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* Modal for Editing Shipping Info */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Shipping Info</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                value={shippingInfo.name}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, name: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                placeholder="Full Name"
                required
              />
              <input
                type="text"
                value={shippingInfo.phone}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                placeholder="Phone Number"
                required
              />
              <textarea
                value={shippingInfo.address}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, address: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
                placeholder="Address"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
