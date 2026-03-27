const { validationResult } = require("express-validator");
const { ApiError } = require("../utils/apiError");

function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const issues = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return next(new ApiError(400, "Validation error", { issues }));
}

module.exports = { validate };

