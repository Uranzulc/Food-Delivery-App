import jwt from "jsonwebtoken";

// Reads the JWT and puts { userId, role } on req.user. 401 if missing or invalid.
export default function requireToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please log in" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Log in again" });
  }
};
