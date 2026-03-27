const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { ApiError } = require("../utils/apiError");
const { sendResponse } = require("../utils/apiResponse");

function signToken(userId) {
  return jwt.sign({ _id: String(userId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
}

async function signup(req, res, next) {
  try {
    const { name = "", email, password } = req.body || {};
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    const token = signToken(user._id);

    return sendResponse(res, {
      status: 201,
      message: "Signup success",
      data: {
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = signToken(user._id);
    return sendResponse(res, {
      status: 200,
      message: "Login success",
      data: {
        token,
        user: { _id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { signup, login };

