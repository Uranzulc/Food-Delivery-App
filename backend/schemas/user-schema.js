import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // never returned by default
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    address: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
