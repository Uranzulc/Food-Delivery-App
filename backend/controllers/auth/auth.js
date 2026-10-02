import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../schemas/user-schema.js";
import asyncHandler from "../../middleware/async-handler.js";

const publicUser = (u) => ({ _id: u._id, email: u.email, role: u.role, address: u.address });

export const signUp = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const address = String(req.body.address || "").trim();

  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Enter a valid email" });
  if (password.length < 8) return res.status(400).json({ message: "At least 8 characters" });

  if (await User.findOne({ email })) {
    return res.status(409).json({ message: "This email already has an account" });
  }

  const hash = await bcrypt.hash(password, 10);
  try {
    // role is never taken from the request: everyone who signs up is a USER
    const user = await User.create({ email, password: hash, address, role: "USER" });
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "This email already has an account" });
    throw err;
  }
});

export const login = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = await User.findOne({ email }).select("+password");
  const ok = user && (await bcrypt.compare(password, user.password));
  // one message for wrong email AND wrong password
  if (!ok) return res.status(401).json({ message: "Email or password is wrong" });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: publicUser(user) });
});
