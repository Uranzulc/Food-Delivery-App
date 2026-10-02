import mongoose from "mongoose";
import FoodCategory from "../../schemas/food-category.js";
import Food from "../../schemas/food.js";
import asyncHandler from "../../middleware/async-handler.js";

export default asyncHandler(async (req, res) => {
  const id = req.body?.id || req.query.id;
  if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "Category not found" });

  // A category with dishes would leave dishes pointing at nothing.
  if (await Food.exists({ category: id })) {
    return res.status(409).json({ message: "Delete or move this category's dishes first" });
  }
  const category = await FoodCategory.findByIdAndDelete(id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Deleted", id });
});
