"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("paymentId");
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      Swal.fire({
        icon: "error",
        title: "Payment ID missing",
        text: "Cannot verify payment without a payment ID.",
      });
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment/verify?paymentId=${paymentId}`);
        if (!res.ok) throw new Error("Payment verification failed.");

        const data = await res.json().catch(() => ({}));

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Redirecting to your order details...",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
          setTimeout(() => router.push(`/orders/${paymentId}`), 3000);
        } else {
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: data.message || "Your payment could not be processed.",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "warning",
          title: "Verification Error",
          text: err.message || "Unexpected error during verification.",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [paymentId, router]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Confirmation</h1>
      {verifying ? (
        <p className="text-gray-700">🔄 Verifying your payment...</p>
      ) : (
        <p className="text-gray-700">Check the SweetAlert2 popup for the result.</p>
      )}
    </div>
  );
}
