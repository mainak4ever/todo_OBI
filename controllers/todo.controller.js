const { userService, todoService } = require("../sevices");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");

// add todo
const addTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required!");
  }
  const user = req.user._id;
  const todo = await todoService.createTodo({ user, title, description });

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo added successfully"));
});

// update todo
const updateTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await todoService.updateTodo(todoId, { ...req.body });

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

// get Todo
const getTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const todo = await todoService.getTodoById(todoId);

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

// delete Todo
const deleteTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  await todoService.deleteTodo(todoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Todo deleted successfully"));
});

// get all todo's by user
const getTodosByUser = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const todos = await todoService.getTodosByUser(user);

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todo fetched successfully"));
});

module.exports = {
  addTodo,
  updateTodo,
  getTodo,
  deleteTodo,
  getTodosByUser,
};
