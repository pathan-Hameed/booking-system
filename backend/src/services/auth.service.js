import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { Session } from "../models/Session.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../utils/tokens.js";

function getRefreshExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

function buildUserPayload(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
  };
}

async function createAuthSession(user, meta) {
  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: "temp",
    userAgent: meta.userAgent,
    ip: meta.ip,
    expiresAt: getRefreshExpiryDate(),
  });

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    sessionId: session._id.toString(),
    type: "access",
  });

  const refreshToken = signRefreshToken({
    sub: user._id.toString(),
    sessionId: session._id.toString(),
    type: "refresh",
  });

  session.refreshTokenHash = hashToken(refreshToken);
  await session.save();

  return {
    accessToken,
    refreshToken,
    user: buildUserPayload(user),
  };
}

export async function adminLogin({ email, password }, meta) {
  
  const user = await User.findOne({ email, role: { $in: ["admin", "employee"] } });
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  return createAuthSession(user, meta);
}

export async function registerUser({ name, email, password, phone }, meta) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "Email already registered");

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    passwordHash,
    phone: phone || "",
    role: "user",
  });

  return createAuthSession(user, meta);
}

export async function loginUser({ email, password }, meta) {
  const user = await User.findOne({ email, role: "user" });
  if (!user || !user.isActive) throw new ApiError(401, "Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  return createAuthSession(user, meta);
}

export async function refreshAuth(refreshToken, meta) {
  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid/expired refresh token");
  }

  if (decoded.type !== "refresh") {
    throw new ApiError(401, "Invalid token type");
  }

  const session = await Session.findById(decoded.sessionId);
  if (!session || session.isRevoked) throw new ApiError(401, "Session expired");
  if (session.expiresAt.getTime() < Date.now()) throw new ApiError(401, "Session expired");

  const incomingHash = hashToken(refreshToken);

  if (session.refreshTokenHash !== incomingHash) {
    session.isRevoked = true;
    await session.save();
    throw new ApiError(401, "Refresh token reuse detected");
  }

  const user = await User.findById(decoded.sub);
  if (!user || !user.isActive) {
    session.isRevoked = true;
    await session.save();
    throw new ApiError(401, "User not found or inactive");
  }

  const newSession = await Session.create({
    userId: user._id,
    refreshTokenHash: "temp",
    userAgent: meta.userAgent || session.userAgent,
    ip: meta.ip || session.ip,
    expiresAt: getRefreshExpiryDate(),
    lastUsedAt: new Date(),
  });

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    role: user.role,
    sessionId: newSession._id.toString(),
    type: "access",
  });

  const newRefreshToken = signRefreshToken({
    sub: user._id.toString(),
    sessionId: newSession._id.toString(),
    type: "refresh",
  });

  newSession.refreshTokenHash = hashToken(newRefreshToken);
  await newSession.save();

  session.isRevoked = true;
  session.replacedBySessionId = newSession._id;
  session.lastUsedAt = new Date();
  await session.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: buildUserPayload(user),
  };
}

export async function logout(refreshToken) {
  if (!refreshToken) return;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const session = await Session.findById(decoded.sessionId);

    if (session) {
      session.isRevoked = true;
      session.lastUsedAt = new Date();
      await session.save();
    }
  } catch {
    return;
  }
}

export async function logoutAll(userId) {
  await Session.updateMany(
    { userId, isRevoked: false },
    { $set: { isRevoked: true, lastUsedAt: new Date() } }
  );
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId).lean();
  if (!user || !user.isActive) throw new ApiError(404, "User not found");

  return buildUserPayload(user);
}