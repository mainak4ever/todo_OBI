const { Todo } = require("../models/todo.model");
const { ApiError } = require("../utils/ApiError");

// Create todo
const createTodo = async (reqBody) => {
  try {
    const todo = await Todo.create(reqBody);
    return todo;
  } catch (error) {
    throw new ApiError(400, "Something went wrong while creating the todo.");
  }
};

// Read todo
const getTodoById = async (todoId) => {
  try {
    const todo = await Todo.findById(todoId);
    if (!todo) {
      throw new ApiError(404, "Todo not found.");
    }
    return todo;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

// Get all todos by user
const getTodosByUser = async (userId) => {
  try {
    const todos = await Todo.find({ user: userId });
    if (!todos) {
      throw new ApiError(404, "Todos not found.");
    }
    return todos;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

// Update todo
const updateTodo = async (todoId, updateBody) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      todoId,
      { ...updateBody },
      {
        new: true,
      }
    );
    if (!todo) {
      throw new ApiError(404, "Todo not found.");
    }
    return todo;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

// Delete todo
const deleteTodo = async (todoId) => {
  console.log(todoId);
  try {
    const todo = await Todo.findByIdAndDelete(todoId);
    if (!todo) {
      throw new ApiError(404, "Todo not found.");
    }
    return todo;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

module.exports = {
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodosByUser,
};
