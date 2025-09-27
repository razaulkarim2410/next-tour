"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("paymentId");
  const [status, setStatus] = useState("Verifying...");

  useEffect(() => {
    if (!paymentId) return;

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment/verify?paymentId=${paymentId}`);
        const data = await res.json();

        if (data.success) {
          setStatus("✅ Payment Successful!");
          // Redirect to order details after 3s
          setTimeout(() => router.push(`/orders/${paymentId}`), 3000);
        } else {
          setStatus("❌ Payment Failed. Please try again.");
        }
      } catch (err) {
        console.error("Verify Error:", err);
        setStatus("⚠️ Verification Error. Check console.");
      }
    };

    verifyPayment();
  }, [paymentId, router]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold">Payment Confirmation</h1>
      <p className="mt-4">{status}</p>
    </div>
  );
}
