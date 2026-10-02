import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./connectDB.js";
import authRouter from "./router/auth/auth.js";
import foodCategoryRouter from "./router/food-category/food-category-router.js";
import foodRouter from "./router/food/food-router.js";
import orderRouter from "./router/order/order-router.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Nine Day Kitchen API" }));
app.use("/auth", authRouter);
app.use("/food-category", foodCategoryRouter);
app.use("/food", foodRouter);
app.use("/order", orderRouter);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
