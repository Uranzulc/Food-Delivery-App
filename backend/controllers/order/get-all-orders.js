import Order from "../../schemas/order.js";
import asyncHandler from "../../middleware/async-handler.js";

export default asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "email")
    .populate("items.food", "name image");
  res.json(orders);
});
