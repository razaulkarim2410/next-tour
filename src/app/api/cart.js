import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getSession({ req });

  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const userId = session.user.id;

  if (req.method === "POST") {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const index = cart.items.findIndex((i) => i.product.toString() === productId);
      if (index >= 0) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    return res.status(200).json(cart);
  }

  if (req.method === "GET") {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    return res.status(200).json(cart || { items: [] });
  }

  res.status(405).json({ error: "Method not allowed" });
}
