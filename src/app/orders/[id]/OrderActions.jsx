"use client";

import { useState } from "react";
import { initiatePayment } from "@/utils/initiatePayment";

export default function OrderActions({ order }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const handlePayNow = async () => {
    setError("");
    if (!order) return setError("Missing order details.");

    try {
      setPaying(true);
      await initiatePayment({
        _id: order._id,
        amount: order.total || order.amount,
        name: order.customerName || order.name,
        email: order.customerEmail || order.email || "guest@example.com",
        phone: order.customerPhone || order.phone,
        address: order.customerAddress || order.address,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="mt-4">
      {order?.status !== "paid" ? (
        <>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button
            onClick={handlePayNow}
            disabled={paying}
            className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {paying ? "Redirecting to payment..." : "Pay Now"}
          </button>
        </>
      ) : (
        <p className="text-green-600 font-semibold">✅ Payment {order.status}</p>
      )}
    </div>
  );
}
