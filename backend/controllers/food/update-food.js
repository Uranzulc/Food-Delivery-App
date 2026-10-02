import mongoose from "mongoose";
import Food from "../../schemas/food.js";
import asyncHandler from "../../middleware/async-handler.js";
import { parseFood } from "./helpers.js";

export default asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Dish not found" });

  const { error, data } = await parseFood(req.body);
  if (error) return res.status(400).json({ message: error });

  const food = await Food.findByIdAndUpdate(req.params.id, data, { new: true }).populate("category");
  if (!food) return res.status(404).json({ message: "Dish not found" });
  res.json(food);
});
