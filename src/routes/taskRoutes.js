const express = require("express");
const { body } = require("express-validator");

const { auth } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  addTask,
  allTask,
  viewSingleTask,
  taskStatus,
  updateTask,
  deleteTask,
  tasksReorder,
} = require("../controllers/taskController");

const router = express.Router();

router.post(
  "/add_task",
  auth,
  [
    body("title").optional().isString().withMessage("Title must be a string").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().isString().withMessage("Description must be a string"),
  ],
  validate,
  addTask
);
router.get("/all_task", auth, allTask);
router.get("/view_single_task/:id", auth, viewSingleTask);

// Postman name: task_status (POST). Some collections use /task_status/:id, others send taskId in body.
router.post(
  "/task_status",
  auth,
  [
    body("status").optional().isString().withMessage("Status must be a string"),
    body("isCompleted").optional().isBoolean().withMessage("isCompleted must be a boolean"),
    body("taskId").optional().isString().withMessage("taskId must be a string"),
  ],
  validate,
  taskStatus
);
router.post(
  "/task_status/:id",
  auth,
  [
    body("status").optional().isString().withMessage("Status must be a string"),
    body("isCompleted").optional().isBoolean().withMessage("isCompleted must be a boolean"),
    body("taskId").optional().isString().withMessage("taskId must be a string"),
  ],
  validate,
  taskStatus
);

router.post(
  "/update_task/:id",
  auth,
  [
    body("title").optional().isString().withMessage("Title must be a string"),
    body("description").optional().isString().withMessage("Description must be a string"),
  ],
  validate,
  updateTask
);
router.get("/delete_task/:id", auth, deleteTask);
router.post(
  "/tasks_reorder",
  auth,
  [body("taskIds").isArray({ min: 1 }).withMessage("taskIds must be a non-empty array")],
  validate,
  tasksReorder
);

module.exports = router;
