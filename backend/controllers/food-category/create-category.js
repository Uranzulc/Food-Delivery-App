import FoodCategory from "../../schemas/food-category.js";
import asyncHandler from "../../middleware/async-handler.js";
import { cleanName, validateName } from "./helpers.js";

export default asyncHandler(async (req, res) => {
  const name = cleanName(req.body);
  const problem = validateName(name);
  if (problem) return res.status(400).json({ message: problem });

  if (await FoodCategory.findOne({ categoryName: name }).collation({ locale: "en", strength: 2 })) {
    return res.status(409).json({ message: "This category already exists" });
  }
  const category = await FoodCategory.create({ categoryName: name });
  res.status(201).json(category);
});
