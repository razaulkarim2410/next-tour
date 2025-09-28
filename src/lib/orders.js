// src/lib/orders.js
import dbConnect from "./dbConnect"; // your mongoose connection
import Order from "../models/Order";  // your Order model

export async function getOrderById(orderId) {
  await dbConnect();
  const order = await Order.findById(orderId);
  return order;
}
