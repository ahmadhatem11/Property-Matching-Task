import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (req.user.role === "ADMIN" || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: "Access denied" });
  };
};
