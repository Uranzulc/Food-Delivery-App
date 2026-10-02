import mongoose from "mongoose";
import Order from "../../schemas/order.js";
import asyncHandler from "../../middleware/async-handler.js";

const STATUSES = ["PENDING", "DELIVERED", "CANCELED"];

export default asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: "Status must be PENDING, DELIVERED or CANCELED" });
  }
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Order not found" });

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    .populate("user", "email")
    .populate("items.food", "name image");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});
