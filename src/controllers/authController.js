import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  const comparePassword = await user.comparePassword(password);

  if (!user || !comparePassword) {
    return res.status(401).json({ message: "Invalid phone or password" });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.json({ token });
};
