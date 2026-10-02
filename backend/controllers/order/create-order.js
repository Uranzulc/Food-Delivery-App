import mongoose from "mongoose";
import Food from "../../schemas/food.js";
import Order from "../../schemas/order.js";
import asyncHandler from "../../middleware/async-handler.js";

// Body: { items: [{ foodId, quantity }], address }
// Any price sent by the client is ignored. Prices are looked up here.
export default asyncHandler(async (req, res) => {
  const { items, address } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Your cart is empty" });
  }
  if (!address || String(address).trim().length < 5) {
    return res.status(400).json({ message: "Enter a delivery address" });
  }

  for (const item of items) {
    const id = item.foodId || item.food;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid dish in cart" });
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return res.status(400).json({ message: "Quantity must be 1 or more" });
    }
  }

  const ids = items.map((i) => i.foodId || i.food);
  const foods = await Food.find({ _id: { $in: ids } });
  const byId = new Map(foods.map((f) => [String(f._id), f]));

  const orderItems = [];
  for (const item of items) {
    const food = byId.get(String(item.foodId || item.food));
    if (!food) return res.status(404).json({ message: "A dish in your cart is no longer available" });
    orderItems.push({ food: food._id, name: food.name, quantity: item.quantity, price: food.price });
  }

  const total = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // user comes from the token, never from the body
  const order = await Order.create({
    user: req.user.userId,
    items: orderItems,
    total,
    status: "PENDING",
    address: String(address).trim(),
  });
  res.status(201).json(order);
});
