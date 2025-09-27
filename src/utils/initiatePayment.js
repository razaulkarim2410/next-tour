// // src/utils/initiatePayment.js

// export async function initiatePayment(cartItems, totalAmount) {
//   try {
//     const res = await fetch("/api/payment", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ cartItems, totalAmount }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || `Payment init failed (status ${res.status})`);
//     }

//     if (!data?.url) {
//       throw new Error("Payment gateway did not return a URL");
//     }

//     return data.url; // return only the URL
//   } catch (err) {
//     console.error("initiatePayment error:", err.message);
//     throw err;
//   }
// }

// src/utils/initiatePayment.js
export async function initiatePayment(cartItems, totalAmount) {
  try {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems, totalAmount }), // ✅ match backend
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to initiate payment");
    }

    const data = await res.json();
    if (!data?.url) {
      throw new Error("Payment gateway did not return a URL");
    }

    return data.url;
  } catch (err) {
    console.error("initiatePayment error:", err);
    throw new Error(err.message || "Payment initialization failed");
  }
}
