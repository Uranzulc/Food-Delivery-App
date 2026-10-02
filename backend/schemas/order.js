import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true }, // copied at order time
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // copied at order time
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["PENDING", "DELIVERED", "CANCELED"], default: "PENDING" },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
