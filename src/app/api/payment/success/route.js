// src/app/api/payment/success/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import fetch from "node-fetch";

if (!global.fetch) global.fetch = fetch;

function parseBodyObj(contentType, rawText, formData) {
  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(rawText));
  }
  if (contentType.includes("multipart/form-data")) {
    const obj = {};
    for (const [k, v] of formData.entries()) obj[k] = v;
    return obj;
  }
  // fallback: JSON
  try {
    return JSON.parse(rawText || "{}");
  } catch {
    return {};
  }
}

export async function POST(req) {
  await dbConnect();
  const contentType = req.headers.get("content-type") || "";
  const rawText = await req.text();
  const formData = contentType.includes("multipart/form-data") ? await req.formData() : null;
  const body = parseBodyObj(contentType, rawText, formData);

  // SSLCommerz typically sends tran_id and val_id (validation id)
  const tran_id = body.tran_id || body.tranID || body.tran_id;
  const val_id = body.val_id;

  if (!tran_id && !val_id) {
    return NextResponse.json({ error: "Missing tran_id / val_id" }, { status: 400 });
  }

  // Choose validation endpoint
  const store_id = process.env.SSLC_STORE_ID;
  const store_passwd = process.env.SSLC_STORE_PASSWORD;
  const is_live = process.env.SSLC_MODE === "live";
  const validationBase = is_live
    ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  let validateUrl;
  if (val_id) {
    validateUrl = `${validationBase}?val_id=${encodeURIComponent(val_id)}&store_id=${encodeURIComponent(store_id)}&store_passwd=${encodeURIComponent(store_passwd)}&format=json`;
  } else {
    // if val_id missing, try tran_id merchantTransId validation endpoint
    const merchantUrlBase = is_live
      ? "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
      : "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";
    validateUrl = `${merchantUrlBase}?tran_id=${encodeURIComponent(tran_id)}&store_id=${encodeURIComponent(store_id)}&store_passwd=${encodeURIComponent(store_passwd)}&format=json`;
  }

  try {
    const vRes = await fetch(validateUrl);
    const vJson = await vRes.json();

    // Check status
    const status = vJson.status || vJson.APIConnect || "";
    // VALID or VALIDATED indicates success (docs)
    const isValid = status === "VALID" || status === "VALIDATED";

    // find order by tran_id (or by stored tran_id)
    const order = await Order.findOne({ transactionId: tran_id });
    if (!order) {
      console.warn("Success webhook: order not found for tran_id", tran_id);
      // still redirect user to a friendly page
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-fail`);
    }

    // verify amounts match
    const returnedAmount = Number(vJson.amount || vJson.store_amount || 0);
    if (!isValid || returnedAmount !== Number(order.total)) {
      // mark failed or suspicious
      await Order.findByIdAndUpdate(order._id, {
        status: "failed",
        sslValidation: vJson,
      });
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-fail?orderId=${order._id}`);
    }

    // success: update order
    await Order.findByIdAndUpdate(order._id, {
      status: "paid",
      paymentMethod: "sslcommerz",
      sslValidation: vJson,
    });

    // Redirect user to client success page with orderId
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-success?orderId=${order._id}`);
  } catch (err) {
    console.error("Payment success validation error:", err);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-fail`);
  }
}

// // src/app/api/payment/success/route.js
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Order from "@/models/Order";
// import fetch from "node-fetch";

// if (!global.fetch) global.fetch = fetch;

// function parseBodyObj(contentType, rawText, formData) {
//   if (contentType.includes("application/x-www-form-urlencoded")) {
//     return Object.fromEntries(new URLSearchParams(rawText));
//   }
//   if (contentType.includes("multipart/form-data")) {
//     const obj = {};
//     for (const [k, v] of formData.entries()) obj[k] = v;
//     return obj;
//   }
//   try {
//     return JSON.parse(rawText || "{}");
//   } catch {
//     return {};
//   }
// }

// export async function POST(req) {
//   await dbConnect();

//   const contentType = req.headers.get("content-type") || "";
//   const rawText = await req.text();
//   const formData = contentType.includes("multipart/form-data") ? await req.formData() : null;
//   const body = parseBodyObj(contentType, rawText, formData);

//   const tran_id = body.tran_id || body.tranID;
//   const val_id = body.val_id;

//   if (!tran_id && !val_id) {
//     return NextResponse.json({ error: "Missing tran_id / val_id" }, { status: 400 });
//   }

//   const store_id = process.env.SSLC_STORE_ID;
//   const store_passwd = process.env.SSLC_STORE_PASSWORD;
//   const is_live = process.env.SSLC_MODE === "live";

//   const validationBase = is_live
//     ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
//     : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

//   const merchantBase = is_live
//     ? "https://securepay.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php"
//     : "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";

//   const validateUrl = val_id
//     ? `${validationBase}?val_id=${encodeURIComponent(val_id)}&store_id=${encodeURIComponent(store_id)}&store_passwd=${encodeURIComponent(store_passwd)}&format=json`
//     : `${merchantBase}?tran_id=${encodeURIComponent(tran_id)}&store_id=${encodeURIComponent(store_id)}&store_passwd=${encodeURIComponent(store_passwd)}&format=json`;

//   try {
//     const vRes = await fetch(validateUrl);
//     const vJson = await vRes.json();

//     const status = vJson.status || vJson.APIConnect || "";
//     const isValid = status === "VALID" || status === "VALIDATED";

//     const order = await Order.findOne({ transactionId: tran_id });

//     if (!order) {
//       console.warn("Success webhook: order not found for tran_id", tran_id);
//       return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-fail`);
//     }

//     if (order.status === "paid") {
//       return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-success?orderId=${order._id}`);
//     }

//     const returnedAmount = Number(vJson.amount || vJson.store_amount || 0);

//     if (!isValid || returnedAmount !== Number(order.total)) {
//       await Order.findByIdAndUpdate(order._id, {
//         status: "failed",
//         sslcommerz: { validation: vJson, validatedAt: new Date() },
//       });
//       return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-fail?orderId=${order._id}`);
//     }

//     await Order.findByIdAndUpdate(order._id, {
//       status: "paid",
//       paymentMethod: "sslcommerz",
//       sslcommerz: { validation: vJson, validatedAt: new Date() },
//     });

//     return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-success?orderId=${order._id}`);
//   } catch (err) {
//     console.error("Payment success validation error:", err);
//     return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/checkout/payment-fail`);
//   }
// }
