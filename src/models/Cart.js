import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new mongoose.Schema(
  {
    user: { type: String, required: true }, // store user email
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
