

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { initiatePayment } from "@/utils/initiatePayment";

export default function CheckoutContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: "Razaul Karim",
    phone: "+8801XXXXXXXXX",
    address: "purbadhala bazar, Purbadhola Saddar, Netrokona, Mymensingh",
  });

  const router = useRouter();
  const params = useSearchParams();
  const { data: session } = useSession();

  const productId = params.get("productId");
  const qty = parseInt(params.get("qty")) || 1;

  // 🔄 Fetch cart/product data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (productId) {
          const res = await fetch(`/api/products/${productId}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const product = await res.json();
          setItems(product ? [{ product, quantity: qty }] : []);
        } else {
          const res = await fetch("/api/cart");
          if (!res.ok) throw new Error("Failed to fetch cart");
          const data = await res.json();
          setItems(Array.isArray(data.items) ? data.items.filter(i => i?.product) : []);
        }
      } catch (err) {
        console.error("❌ Failed to fetch checkout data:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId, qty]);

  // 🧮 Totals
  const subtotal = items.reduce((sum, i) => {
    const price = i?.product?.price ?? 0;
    const quantity = i?.quantity ?? 0;
    return sum + price * quantity;
  }, 0);

  const shipping = subtotal > 2000 ? 0 : 100;
  const discount = voucher === "DISCOUNT50" ? 50 : 0;
  const total = subtotal + shipping - discount;

  // 🚀 Proceed handler with full error handling
  const handleProceed = async () => {
    try {
      if (!session) {
        return Swal.fire({
          icon: "warning",
          title: "Login Required",
          text: "You must be logged in to proceed with payment.",
        });
      }

      if (!Array.isArray(items) || items.length === 0) {
        return Swal.fire({
          icon: "info",
          title: "Cart is Empty",
          text: "Please add some items before proceeding to checkout.",
        });
      }

      // const paymentUrl = await initiatePayment(items, total);
      const paymentUrl = await initiatePayment(items, total);


      if (paymentUrl) {
        window.location.href = paymentUrl; // SSLCommerz redirect
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Failed to get payment link. Please try again later.",
        });
      }
    } catch (err) {
      console.error("handleProceed error:", err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: err?.message || "We couldn't initiate the payment. Please try again later.",
      });
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
        {items.length === 0 && (
          <p className="text-gray-500 text-center py-6">No items in checkout.</p>
        )}
        {items.map(({ product, quantity }) =>
          product ? (
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
          ) : null
        )}
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
            className="w-full bg-orange-600 text-white py-3 hover:bg-orange-700 disabled:opacity-50"
            disabled={items.length === 0}
          >
            Proceed to Pay
          </button>
        </div>
      </div>

      {/* Modal */}
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