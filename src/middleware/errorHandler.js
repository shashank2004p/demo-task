const mongoose = require("mongoose");
const { sendResponse } = require("../utils/apiResponse");

function normalizeError(err) {
  if (!err) return { status: 500, message: "Server error" };

  const status = Number(err.status) || 0;
  if (status) {
    return { status, message: err.message || "Error", details: err.details };
  }

  // JWT
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError" || err.name === "NotBeforeError") {
    return { status: 401, message: "Unauthorized" };
  }

  // Mongoose / Mongo
  if (err instanceof mongoose.Error.ValidationError) {
    const issues = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return { status: 400, message: "Validation error", details: { issues } };
  }

  if (err instanceof mongoose.Error.CastError) {
    return { status: 400, message: "Invalid identifier" };
  }

  // Duplicate key
  if (err && err.code === 11000) {
    const keys = Object.keys(err.keyPattern || err.keyValue || {});
    return { status: 409, message: "Already exists", details: { keys } };
  }

  return { status: 500, message: "Server error" };
}

function errorHandler(err, _req, res, _next) {
  const normalized = normalizeError(err);
  if (process.env.NODE_ENV !== "test") console.error(err);
  return sendResponse(res, {
    status: normalized.status,
    message: normalized.message,
    data: null,
    errors: normalized.details,
  });
}

module.exports = { errorHandler };

