"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CreditCard, Smartphone, Banknote, Wallet } from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState(""); // selected payment method

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  const handleConfirm = async () => {
    if (!method) return alert("Please select a payment method");

    // ⚡ Here you would integrate real payment gateway
    alert(`Proceeding with ${method} payment`);

    // Optionally: call API to update order status
    await fetch(`/api/orders/${id}/pay`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, status: "paid" }),
    });

    router.push("/checkout/success");
  };

  if (!order) return <p className="text-center mt-10">Loading order...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Payment Methods */}
        <div className="md:col-span-2 bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-600" />
            Select Payment Method
          </h2>

          {/* Options side by side */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card */}
            <div
              onClick={() => setMethod("card")}
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                method === "card"
                  ? "border-orange-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <CreditCard className="w-6 h-6 text-blue-600 mb-2" />
              <span className="font-medium text-sm text-center">
                Credit/Debit Card
              </span>
            </div>

            {/* Nagad */}
            <div
              onClick={() => setMethod("nagad")}
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                method === "nagad"
                  ? "border-orange-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <Smartphone className="w-6 h-6 text-orange-600 mb-2" />
              <span className="font-medium text-sm">Nagad</span>
            </div>

            {/* bKash */}
            <div
              onClick={() => setMethod("bkash")}
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                method === "bkash"
                  ? "border-orange-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <Smartphone className="w-6 h-6 text-pink-600 mb-2" />
              <span className="font-medium text-sm">bKash</span>
            </div>

            {/* Cash on Delivery */}
            <div
              onClick={() => setMethod("cod")}
              className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center ${
                method === "cod"
                  ? "border-orange-600 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <Wallet className="w-6 h-6 text-gray-600 mb-2" />
              <span className="font-medium text-sm text-center">
                Cash on Delivery
              </span>
            </div>
          </div>

          {/* Details under selection */}
          <div className="mt-6">
            {method === "card" && (
              <div className="space-y-4">
                <h3 className="font-semibold">Enter Card Details</h3>
                <div className="grid grid-cols-1">
                  <p><span className="text-red-600 text-xl">*</span>Card Number</p>
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full border rounded px-3 py-2"
                />
                </div>
                <div className="grid grid-cols-1">
                  <p><span className="text-red-600 text-xl">*</span>Name on Card</p>
                <input
                  type="text"
                  placeholder="Name on Card"
                  className="w-full border rounded px-3 py-2"
                />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1">
                    <p><span className="text-red-600 text-xl">*</span>Expiry date</p>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full border rounded px-3 py-2"
                  />
                  </div>
                   <div className="grid grid-cols-1">
                    <p><span className="text-red-600 text-xl ">*</span>CVV</p>
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full border rounded px-3 py-2"
                  />
                   </div>
                </div>
                <button
                  onClick={handleConfirm}
                  className="mt-2 bg-orange-600 text-white px-28 py-3 rounded-lg hover:bg-orange-700"
                >
                  Pay Now
                </button>
              </div>
            )}

            {method === "nagad" && (
              <div className="space-y-3">
                <h3 className="font-semibold">Nagad Payment</h3>
                <p className="text-gray-700 text-sm">
                  1. You have an activated Nagad Account <br />
                  2. You are able to receive an OTP on your registered Mobile Number. <br />
                  3. You have sufficient balance in your account to carry out the transaction
                </p>
                <button
                  onClick={handleConfirm}
                  className="mt-2 bg-orange-600 text-white px-28 py-3 rounded-lg hover:bg-orange-700"
                >
                  Pay Now
                </button>
              </div>
            )}

            {method === "bkash" && (
              <div className="space-y-3">
                <h3 className="font-semibold">bKash Payment</h3>
                <p className="text-gray-700 text-sm">
                   1) First-time users: Enter Wallet Number & OTP to save account. <br />
                  2) Returning users: Enter PIN to make payment. <br />
                  Disclaimer: You will be redirected back to Checkout for first transaction. <br />
                  <br />
                  Please Note: <br />
                  - You have an activated bKash account <br />
                  - Ensure sufficient balance <br />
                  - Ensure OTP reception on your mobile <br />
                  - Only one bKash account can be linked per NextTour account
                </p>
                <button
                  onClick={handleConfirm}
                  className="mt-2 bg-orange-600 text-white px-28 py-3 rounded-lg hover:bg-orange-700"
                >
                  Pay Now
                </button>
              </div>
            )}

            {method === "cod" && (
              <div className="space-y-3">
                <h3 className="font-semibold">Cash on Delivery</h3>
                <p className="text-gray-700 text-sm">
                  - Pay in cash upon receiving your parcel. <br />
                  - Confirm delivery status is 'Out for Delivery'. <br />
                  - Check airway bill to ensure parcel is from NextTour. <br />
                  - Confirm order number, sender info, and tracking before paying courier.
                </p>
                <button
                  onClick={handleConfirm}
                  className="mt-2 bg-orange-600 text-white px-24 py-3 rounded-lg hover:bg-orange-700"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-gray-700">
            <p>
              Subtotal ({order.items.length} item
              {order.items.length > 1 ? "s" : ""}):{" "}
              <span className="font-semibold">$ {order.subtotal.toFixed(2)}</span>
            </p>
            <p>Shipping Fee: $ {order.shipping.toFixed(2)}</p>
            {order.discount > 0 && <p>Discount: -$ {order.discount.toFixed(2)}</p>}
            <p className="text-lg font-bold">Total Amount: $ {order.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
