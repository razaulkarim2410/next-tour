"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState("Updating order...");

  useEffect(() => {
    if (!orderId) return;

    const updateOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/pay`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "SSLCommerz" }),
        });
        if (res.ok) {
          setStatus("✅ Payment successful and order updated!");
        } else {
          setStatus("⚠️ Payment recorded but order update failed.");
        }
      } catch (err) {
        setStatus("⚠️ Error updating order: " + err.message);
      }
    };

    updateOrder();
  }, [orderId]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Success</h1>
      <p>{status}</p>
    </div>
  );
}
