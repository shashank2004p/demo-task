class ApiError extends Error {
  /**
   * @param {number} status HTTP status code
   * @param {string} message safe client-facing message
   * @param {any} details optional extra error details (e.g. validation issues)
   */
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = Number(status) || 500;
    if (details !== undefined) this.details = details;
  }
}

module.exports = { ApiError };

