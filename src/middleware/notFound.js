const { sendResponse } = require("../utils/apiResponse");

function notFound(req, res, _next) {
  return sendResponse(res, {
    status: 404,
    message: "Route not found",
    data: [],
    errors: { path: req.originalUrl, method: req.method },
  });
}

module.exports = { notFound };

