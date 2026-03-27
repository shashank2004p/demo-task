const mongoose = require("mongoose");

const Task = require("../models/Task");
const { ApiError } = require("../utils/apiError");
const { sendResponse } = require("../utils/apiResponse");

function mustOwnQuery(taskId, userId) {
  return { _id: taskId, userId };
}

async function addTask(req, res, next) {
  try {
    const { title, description = "" } = req.body || {};

    const last = await Task.findOne({ userId: req.userId }).sort({ order: -1 }).select("order").lean();
    const nextOrder = typeof last?.order === "number" ? last.order + 1 : 0;

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      order: nextOrder,
    });

    return sendResponse(res, { status: 201, message: "Task created", data: task });
  } catch (err) {
    return next(err);
  }
}

async function allTask(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ order: 1, createdAt: -1 });
    return sendResponse(res, { status: 200, message: "Tasks", data: tasks || [] });
  } catch (err) {
    return next(err);
  }
}

async function viewSingleTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid task id");

    const task = await Task.findOne(mustOwnQuery(id, req.userId));
    if (!task) throw new ApiError(404, "Task not found");
    return sendResponse(res, { status: 200, message: "Task", data: task });
  } catch (err) {
    return next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid task id");

    const { title, description } = req.body || {};
    const update = {};
    if (typeof title === "string") update.title = title;
    if (typeof description === "string") update.description = description;

    const task = await Task.findOneAndUpdate(mustOwnQuery(id, req.userId), update, { new: true });
    if (!task) throw new ApiError(404, "Task not found");

    return sendResponse(res, { status: 200, message: "Task updated", data: task });
  } catch (err) {
    return next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid task id");

    const result = await Task.deleteOne(mustOwnQuery(id, req.userId));
    if (result.deletedCount === 0) throw new ApiError(404, "Task not found");

    return sendResponse(res, { status: 200, message: "Task deleted", data: [] });
  } catch (err) {
    return next(err);
  }
}

async function taskStatus(req, res, next) {
  try {
    const taskId = req.params?.id || req.body?.taskId;
    const { status, isCompleted } = req.body || {};

    if (!mongoose.isValidObjectId(taskId)) throw new ApiError(400, "Invalid task id");

    let nextStatus = status;
    if (!nextStatus && typeof isCompleted === "boolean") nextStatus = isCompleted ? "completed" : "pending";
    if (!["pending", "completed"].includes(nextStatus)) throw new ApiError(400, "Invalid status");

    const task = await Task.findOneAndUpdate(mustOwnQuery(taskId, req.userId), { status: nextStatus }, { new: true });
    if (!task) throw new ApiError(404, "Task not found");

    return sendResponse(res, { status: 200, message: "Task status updated", data: task });
  } catch (err) {
    return next(err);
  }
}

async function tasksReorder(req, res, next) {
  try {
    const { taskIds } = req.body || {};

    const ids = taskIds.map(String);
    const bulk = ids.map((id, idx) => ({
      updateOne: {
        filter: mustOwnQuery(id, req.userId),
        update: { $set: { order: idx } },
      },
    }));

    await Task.bulkWrite(bulk, { ordered: false });
    return sendResponse(res, { status: 200, message: "Tasks reordered", data: [] });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addTask,
  allTask,
  viewSingleTask,
  taskStatus,
  updateTask,
  deleteTask,
  tasksReorder,
};

