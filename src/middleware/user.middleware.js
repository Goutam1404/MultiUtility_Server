import jwt from "jsonwebtoken";

export function useAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not logged in" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("In auth middleware", decoded);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (err) {
    console.log("JWT verify error", err.message);
    return res.status(401).json({ message: "Invalid token", err: err.message });
  }
}
