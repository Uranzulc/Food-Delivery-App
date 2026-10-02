import Food from "../../schemas/food.js";
import asyncHandler from "../../middleware/async-handler.js";
import { parseFood } from "./helpers.js";

export default asyncHandler(async (req, res) => {
  const { error, data } = await parseFood(req.body);
  if (error) return res.status(400).json({ message: error });

  const food = await Food.create(data);
  await food.populate("category");
  res.status(201).json(food);
});
