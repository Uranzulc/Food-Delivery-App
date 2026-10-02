import mongoose from "mongoose";
import Food from "../../schemas/food.js";
import asyncHandler from "../../middleware/async-handler.js";

export default asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Dish not found" });
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) return res.status(404).json({ message: "Dish not found" });
  res.json({ message: "Deleted", id: req.params.id });
});
