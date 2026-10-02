// Must run AFTER requireToken. 403 for logged-in users who are not admins.
export default function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
