import mongoose from "mongoose";
import FoodCategory from "../../schemas/food-category.js";
import asyncHandler from "../../middleware/async-handler.js";
import { cleanName, validateName } from "./helpers.js";

export default asyncHandler(async (req, res) => {
  const id = req.body.id || req.query.id;
  const name = cleanName(req.body);
  const problem = validateName(name);
  if (problem) return res.status(400).json({ message: problem });
  if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "Category not found" });

  const clash = await FoodCategory.findOne({ categoryName: name, _id: { $ne: id } }).collation({
    locale: "en",
    strength: 2,
  });
  if (clash) return res.status(409).json({ message: "This category already exists" });

  const category = await FoodCategory.findByIdAndUpdate(id, { categoryName: name }, { new: true });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
});
