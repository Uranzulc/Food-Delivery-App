import mongoose from "mongoose";
import FoodCategory from "../../schemas/food-category.js";

// Same rules as the browser form. Returns { error } or { data }.
export const parseFood = async (body) => {
  const name = String(body.name || "").trim();
  const price = Number(body.price);
  const image = String(body.image || "").trim();

  let ingredients = body.ingredients ?? [];
  if (typeof ingredients === "string") ingredients = ingredients.split(",");
  ingredients = ingredients.map((i) => String(i).trim()).filter(Boolean);

  if (!name) return { error: "Food name is required" };
  if (!Number.isFinite(price) || price <= 0) return { error: "Price must be a number above 0" };
  if (!body.category || !mongoose.isValidObjectId(body.category)) return { error: "Choose a category" };
  if (!(await FoodCategory.exists({ _id: body.category }))) return { error: "Choose a category" };

  return { data: { name, price, image, ingredients, category: body.category } };
};
