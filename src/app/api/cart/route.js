import Product from "@/models/Product"; // ✅ This is required
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";


// GET /api/cart
export async function GET(req) {
  try {
    console.log("🔵 GET /api/cart called");

    const session = await getServerSession(authOptions);
    console.log("Session:", session?.user?.email);

    if (!session)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });

    await dbConnect();
    console.log("✅ DB Connected");

    const cart = await Cart.findOne({ user: session.user.email }).populate(
      "items.product"
    );
    console.log("Cart Found:", cart);

    return new Response(JSON.stringify({ items: cart?.items || [] }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ GET /api/cart error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

// // POST /api/cart
// export async function POST(req) {
//   try {
//     console.log("🟢 POST /api/cart called");

//     const session = await getServerSession(authOptions);
//     console.log("Session:", session?.user?.email);

//     if (!session)
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//       });

//     const body = await req.json();
//     console.log("Request Body:", body);

//     const { productId, quantity } = body;

//     await dbConnect();
//     console.log("✅ DB Connected");

//     let cart = await Cart.findOne({ user: session.user.email });
//     console.log("Existing Cart:", cart);

//     if (!cart) cart = new Cart({ user: session.user.email, items: [] });

//     const existing = cart.items.find((i) => i.product.toString() === productId);
//     if (existing) {
//       existing.quantity += quantity;
//     } else {
//       cart.items.push({ product: productId, quantity });
//     }

//     await cart.save();
//     console.log("✅ Cart Saved:", cart);

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("❌ POST /api/cart error:", error);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }

// POST /api/cart
export async function POST(req) {
  try {
    console.log("🟢 POST /api/cart called");

    const session = await getServerSession(authOptions);
    if (!session)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const body = await req.json();
    const { productId, quantity } = body;

    await dbConnect();

    let cart = await Cart.findOne({ user: session.user.email });
    if (!cart) cart = new Cart({ user: session.user.email, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity <= 0) {
        cart.items = cart.items.filter((i) => i.product.toString() !== productId);
      }
    } else if (quantity > 0) {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // ✅ Return updated cart with populated products
    const populatedCart = await Cart.findOne({ user: session.user.email }).populate(
      "items.product"
    );

    return new Response(JSON.stringify({ items: populatedCart.items }), { status: 200 });
  } catch (error) {
    console.error("❌ POST /api/cart error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
