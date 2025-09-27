import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(req) {
  try {
    const body = await req.json();
    const { cartItems, totalAmount } = body;

    if (!cartItems?.length || !totalAmount) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const store_id = process.env.SSLC_STORE_ID;
    const store_passwd = process.env.SSLC_STORE_PASSWORD;

    const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        store_id,
        store_passwd,
        total_amount: totalAmount,
        currency: "BDT",
        tran_id: `txn_${Date.now()}`,
        success_url: `${process.env.NEXTAUTH_URL}/api/payment/success`,
        fail_url: `${process.env.NEXTAUTH_URL}/api/payment/fail`,
        cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/cancel`,
        // ✅ Customer info (required)
    cus_name: "Customer",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",       // 🔥 Added this line
    cus_postcode: "1207",    // 🔥 SSLCommerz also prefers postcode
    cus_country: "Bangladesh",
    cus_phone: "01711111111",

    // ✅ Product info
    shipping_method: "NO",
    product_name: "Cart Items",
    product_category: "General",
    product_profile: "general",
  }).toString(),
    });

    const result = await response.json();

    if (result?.status !== "SUCCESS") {
      return NextResponse.json(
        { error: "Failed to initiate payment", details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.GatewayPageURL });
  } catch (err) {
    console.error("Payment init error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// // src/app/api/payment/route.js
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Order from "@/models/Order";
// import fetch from "node-fetch";

// if (!global.fetch) global.fetch = fetch;

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const { items, subtotal, shipping, total, customer } = body;

//     // 1️⃣ Validate cart and customer
//     if (!Array.isArray(items) || items.length === 0) {
//       return NextResponse.json(
//         { error: "Cart is empty or invalid items" },
//         { status: 400 }
//       );
//     }

//     for (const item of items) {
//       if (!item.productId || !item.quantity || !item.price) {
//         return NextResponse.json(
//           { error: "Each cart item must include productId, quantity, and price" },
//           { status: 400 }
//         );
//       }
//     }

//     if (!customer || !customer.name || !customer.email || !customer.phone) {
//       return NextResponse.json(
//         { error: "Missing customer information" },
//         { status: 400 }
//       );
//     }

//     if (!total || total <= 0) {
//       return NextResponse.json(
//         { error: "Invalid total amount" },
//         { status: 400 }
//       );
//     }

//     // 2️⃣ Connect to DB and create order
//     await dbConnect();

//     const order = await Order.create({
//       items,
//       subtotal,
//       shipping,
//       total,
//       customer,
//       status: "pending",
//     });

//     // 3️⃣ Prepare SSLCommerz request
//     const store_id = process.env.SSLC_STORE_ID;
//     const store_passwd = process.env.SSLC_STORE_PASSWORD;
//     const sslMode = process.env.SSLC_MODE === "live";
//     const gatewayURL = sslMode
//       ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
//       : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

//     const params = new URLSearchParams({
//       store_id,
//       store_passwd,
//       total_amount: total.toString(),
//       currency: "BDT",
//       tran_id: order._id.toString(),
//       success_url: `${process.env.NEXTAUTH_URL}/api/payment/success`,
//       fail_url: `${process.env.NEXTAUTH_URL}/api/payment/fail`,
//       cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/cancel`,
//       cus_name: customer.name,
//       cus_email: customer.email,
//       cus_add1: customer.address || "",
//       cus_city: customer.city || "",
//       cus_postcode: customer.postcode || "",
//       cus_country: customer.country || "Bangladesh",
//       cus_phone: customer.phone,
//       shipping_method: "NO",
//       product_name: items.map(i => i.name || "Product").join(", "),
//       product_category: "General",
//       product_profile: "general",
//     });

//     // 4️⃣ Send request to SSLCommerz
//     const res = await fetch(gatewayURL, {
//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       body: params.toString(),
//     });

//     const data = await res.json();

//     if (!res.ok || !data?.GatewayPageURL) {
//       console.error("Payment API error:", data);
//       return NextResponse.json(
//         { error: "Failed to initiate payment", details: data },
//         { status: 500 }
//       );
//     }

//     // 5️⃣ Return Gateway URL to frontend
//     return NextResponse.json({ url: data.GatewayPageURL });
//   } catch (err) {
//     console.error("Payment API error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

