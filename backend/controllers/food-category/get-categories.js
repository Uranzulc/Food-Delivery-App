import FoodCategory from "../../schemas/food-category.js";
import asyncHandler from "../../middleware/async-handler.js";

export default asyncHandler(async (req, res) => {
  const categories = await FoodCategory.find().sort({ createdAt: 1 });
  res.json(categories);
});
