import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    ingredients: { type: [String], default: [] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCategory", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
