import Order from "../../schemas/order.js";
import asyncHandler from "../../middleware/async-handler.js";

export default asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
    .sort({ createdAt: -1 })
    .populate("items.food", "name image");
  res.json(orders);
});
