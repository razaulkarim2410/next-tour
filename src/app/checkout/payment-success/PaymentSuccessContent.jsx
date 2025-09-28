"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      Swal.fire({
        icon: "error",
        title: "Missing Order ID",
        text: "Cannot process payment without an order ID.",
      });
      return;
    }

    const updateOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}/pay`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method: "SSLCommerz" }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          await Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: "Your order has been updated successfully!",
            confirmButtonText: "Go to Orders",
          });
          router.push(`/orders/${orderId}`);
        } else {
          await Swal.fire({
            icon: "warning",
            title: "Order Update Failed",
            text: data.error || "Payment succeeded but order update failed.",
          });
          router.push(`/orders/${orderId}`);
        }
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while updating your order: " + err.message,
        });
      }
    };

    updateOrder();
  }, [searchParams, router]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
      <p>Please wait while we update your order.</p>
    </div>
  );
}
