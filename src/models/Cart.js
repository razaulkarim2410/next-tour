


import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user: { type: String, required: true }, // store user email
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
