
import "dotenv/config";
import bcrypt from "bcryptjs";
import connectDB from "./connectDB.js";
import User from "./schemas/user-schema.js";
import FoodCategory from "./schemas/food-category.js";
import Food from "./schemas/food.js";

(async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@food.mn";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  if (!(await User.findOne({ email }))) {
    await User.create({ email, password: await bcrypt.hash(password, 10), role: "ADMIN" });
    console.log(`Admin created: ${email} / ${password}`);
  } else {
    console.log("Admin already exists");
  }

  if ((await FoodCategory.countDocuments()) === 0) {
    const [appetizers, pizza] = await FoodCategory.insertMany([
      { categoryName: "Appetizers" },
      { categoryName: "Pizza" },
    ]);
    await Food.insertMany([
      { name: "Spring rolls", price: 9000, ingredients: ["rice paper", "carrot", "cabbage"], category: appetizers._id },
      { name: "Caesar", price: 12000, ingredients: ["lettuce", "parmesan", "croutons"], category: appetizers._id },
      { name: "Pepperoni", price: 18000, ingredients: ["mozzarella", "pepperoni", "tomato sauce"], category: pizza._id },
      { name: "Margherita", price: 15000, ingredients: ["mozzarella", "basil", "tomato sauce"], category: pizza._id },
    ]);
    console.log("Sample categories and dishes added");
  }
  process.exit(0);
})();
