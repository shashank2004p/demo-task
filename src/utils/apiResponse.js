function sendResponse(res, { status = 200, message = "OK", data = null, meta, errors } = {}) {
  const body = {
    success: status >= 200 && status < 300,
    message,
    data,
  };
  if (meta !== undefined) body.meta = meta;
  if (errors !== undefined) body.errors = errors;
  return res.status(status).json(body);
}

module.exports = { sendResponse };

