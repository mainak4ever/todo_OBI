const {
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodosByUser,
} = require("../sevices/todo.service");
const { Todo } = require("../models/todo.model");
const { ApiError } = require("../utils/ApiError");

// Mocking Todo model
jest.mock("../models/todo.model", () => ({
  Todo: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// Mocking ApiError class
jest.mock("../utils/ApiError", () => ({
  ApiError: jest.fn(),
}));

describe("createTodo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo", async () => {
    const reqBody = {
      title: "Test Todo",
      description: "Test description",
      user: "userId",
    };
    const todo = { ...reqBody, _id: "todoId" };

    Todo.create.mockResolvedValue(todo);

    const result = await createTodo(reqBody);

    expect(Todo.create).toHaveBeenCalledWith(reqBody);
    expect(result).toEqual(todo);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError if todo creation fails", async () => {
    const reqBody = {
      title: "Test Todo",
      description: "Test description",
      user: "userId",
    };
    const errorMessage = "Something went wrong while creating the todo.";
    const error = new Error(errorMessage);

    Todo.create.mockRejectedValue(error);

    try {
      await createTodo(reqBody);
    } catch (error) {
      expect(Todo.create).toHaveBeenCalledWith(reqBody);
      expect(ApiError).toHaveBeenCalledWith(400, errorMessage);
    }
  });
});

describe("getTodoById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the todo if found", async () => {
    const todoId = "todoId";
    const todo = {
      _id: todoId,
      title: "Test Todo",
      description: "Test description",
      user: "userId",
    };

    Todo.findById.mockResolvedValue(todo);

    const result = await getTodoById(todoId);

    expect(Todo.findById).toHaveBeenCalledWith(todoId);
    expect(result).toEqual(todo);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if todo is not found", async () => {
    const todoId = "nonExistentTodoId";

    Todo.findById.mockResolvedValue(null);

    try {
      await getTodoById(todoId);
    } catch (error) {
      expect(Todo.findById).toHaveBeenCalledWith(todoId);
      expect(ApiError).toHaveBeenCalledWith(404, "Todo not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const todoId = "todoId";
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    Todo.findById.mockRejectedValue(error);

    try {
      await getTodoById(todoId);
    } catch (error) {
      expect(Todo.findById).toHaveBeenCalledWith(todoId);
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});

describe("getTodosByUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return todos if found for a user", async () => {
    const userId = "userId";
    const todos = [
      {
        _id: "todoId1",
        title: "Test Todo 1",
        description: "Test description 1",
        user: userId,
      },
      {
        _id: "todoId2",
        title: "Test Todo 2",
        description: "Test description 2",
        user: userId,
      },
    ];

    Todo.find.mockResolvedValue(todos);

    const result = await getTodosByUser(userId);

    expect(Todo.find).toHaveBeenCalledWith({ user: userId });
    expect(result).toEqual(todos);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if todos are not found for a user", async () => {
    const userId = "nonExistentUserId";

    Todo.find.mockResolvedValue([]);

    try {
      await getTodosByUser(userId);
    } catch (error) {
      expect(Todo.find).toHaveBeenCalledWith({ user: userId });
      expect(ApiError).toHaveBeenCalledWith(404, "Todos not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const userId = "userId";
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    Todo.find.mockRejectedValue(error);

    try {
      await getTodosByUser(userId);
    } catch (error) {
      expect(Todo.find).toHaveBeenCalledWith({ user: userId });
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});

describe("updateTodo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update todo successfully", async () => {
    const todoId = "todoId";
    const updateBody = { title: "Updated Todo" };
    const updatedTodo = {
      _id: todoId,
      title: "Updated Todo",
      description: "Test description",
      user: "userId",
    };

    Todo.findByIdAndUpdate.mockResolvedValue(updatedTodo);

    const result = await updateTodo(todoId, updateBody);

    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
      todoId,
      { ...updateBody },
      { new: true }
    );
    expect(result).toEqual(updatedTodo);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if todo is not found", async () => {
    const todoId = "nonExistentTodoId";
    const updateBody = { title: "Updated Todo" };

    Todo.findByIdAndUpdate.mockResolvedValue(null);

    try {
      await updateTodo(todoId, updateBody);
    } catch (error) {
      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        todoId,
        { ...updateBody },
        { new: true }
      );
      expect(ApiError).toHaveBeenCalledWith(404, "Todo not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const todoId = "todoId";
    const updateBody = { title: "Updated Todo" };
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    Todo.findByIdAndUpdate.mockRejectedValue(error);

    try {
      await updateTodo(todoId, updateBody);
    } catch (error) {
      expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(
        todoId,
        { ...updateBody },
        { new: true }
      );
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});

describe("deleteTodo", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete todo successfully", async () => {
    const todoId = "todoId";
    const deletedTodo = {
      _id: todoId,
      title: "Test Todo",
      description: "Test description",
      user: "userId",
    };

    Todo.findByIdAndDelete.mockResolvedValue(deletedTodo);

    const result = await deleteTodo(todoId);

    expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(todoId);
    expect(result).toEqual(deletedTodo);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if todo is not found", async () => {
    const todoId = "nonExistentTodoId";

    Todo.findByIdAndDelete.mockResolvedValue(null);

    try {
      await deleteTodo(todoId);
    } catch (error) {
      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(todoId);
      expect(ApiError).toHaveBeenCalledWith(404, "Todo not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const todoId = "todoId";
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    Todo.findByIdAndDelete.mockRejectedValue(error);

    try {
      await deleteTodo(todoId);
    } catch (error) {
      expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(todoId);
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});
