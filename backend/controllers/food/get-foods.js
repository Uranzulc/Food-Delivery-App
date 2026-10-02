import mongoose from "mongoose";
import Food from "../../schemas/food.js";
import asyncHandler from "../../middleware/async-handler.js";

export default asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.categoryId) {
    if (!mongoose.isValidObjectId(req.query.categoryId)) return res.json([]);
    filter.category = req.query.categoryId;
  }
  const foods = await Food.find(filter).sort({ createdAt: -1 }).populate("category");
  res.json(foods);
});
