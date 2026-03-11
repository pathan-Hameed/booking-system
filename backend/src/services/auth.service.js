import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { signAccessToken } from "../utils/tokens.js";

export async function adminLogin({ email, password }) {
  const user = await User.findOne({ email, role: "admin" });
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  const token = signAccessToken({ id: user._id.toString(), role: user.role });

  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
}