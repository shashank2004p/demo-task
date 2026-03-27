const express = require("express");
const { body } = require("express-validator");

const { signup, login } = require("../controllers/userController");
const { validate } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").exists({ checkFalsy: true }).withMessage("Email is required").isEmail().withMessage("Email must be valid").normalizeEmail(),
    body("password")
      .exists({ checkFalsy: true })
      .withMessage("Password is required")
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").optional().isString().withMessage("Name must be a string").trim().isLength({ max: 100 }).withMessage("Name is too long"),
  ],
  validate,
  signup
);

router.post(
  "/login",
  [
    body("email").exists({ checkFalsy: true }).withMessage("Email is required").isEmail().withMessage("Email must be valid").normalizeEmail(),
    body("password").exists({ checkFalsy: true }).withMessage("Password is required").isString().withMessage("Password must be a string"),
  ],
  validate,
  login
);

module.exports = router;

