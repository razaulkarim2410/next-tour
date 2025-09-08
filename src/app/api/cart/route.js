import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // adjust path if needed
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

// GET /api/cart → fetch logged-in user's cart
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  const cart = await Cart.findOne({ user: session.user.email }).populate("items.product");

  return new Response(
    JSON.stringify({
      items: cart?.items || [],
    }),
    { status: 200 }
  );
}

// POST /api/cart → add item
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { productId, quantity } = body;

  await dbConnect();

  let cart = await Cart.findOne({ user: session.user.email });
  if (!cart) {
    cart = new Cart({ user: session.user.email, items: [] });
  }

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
