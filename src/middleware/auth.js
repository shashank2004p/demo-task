const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiError");

function auth(req, res, next) {
  try {
    const raw =
      req.headers.authorization ||
      req.headers["x-access-token"] ||
      req.headers["x-auth-token"] ||
      "";

    const header = String(raw).trim();
    if (!header) return next(new ApiError(401, "Token missing"));

    // Accept either "Bearer <token>" or "<token>"
    const parts = header.split(" ").filter(Boolean);
    const token = parts.length >= 2 ? parts[1] : parts[0];
    if (!token) return next(new ApiError(401, "Token missing"));

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?._id) return next(new ApiError(401, "Invalid token"));

    req.userId = payload._id;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

module.exports = { auth };

