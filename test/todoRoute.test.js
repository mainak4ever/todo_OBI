const request = require("supertest");
const { app } = require("../app");
const { ApiResponse } = require("../utils/ApiResponse");
const { ApiError } = require("../utils/ApiError");
const todoService = require("../sevices/todo.service"); // Assuming the correct path to todo service

jest.mock("../sevices/todo.service");
jest.mock("../middlewares/auth.middleware", () => ({
  auth: jest.fn((req, res, next) => {
    if (req.headers.authorization === "Bearer valid_token") {
      req.user = { _id: "user_id" };
      next();
    } else {
      res.status(401).send("Unauthorized request");
    }
  }),
}));

describe("POST /api/v1/todos", () => {
  it("should add a new todo successfully", async () => {
    // Mocking the todoService.createTodo function to return a dummy todo
    const mockTodo = {
      _id: "todo_id",
      title: "Test Todo",
      description: "Test Description",
      user: "user_id",
    };
    todoService.createTodo.mockResolvedValue(mockTodo);

    // Mocking the request body
    const requestBody = {
      title: "Test Todo",
      description: "Test Description",
    };

    // Making the request to the endpoint
    const response = await request(app)
      .post("/api/v1/todos")
      .send(requestBody)
      .set("Authorization", "Bearer valid_token");

    // Asserting the response
    expect(response.status).toBe(200);
  });

  it("should return an error if title is missing", async () => {
    // Making the request with missing title
    const response = await request(app)
      .post("/api/v1/todos")
      .send({ description: "Test Description" })
      .set("Authorization", "Bearer valid_token");

    // Asserting the response
    expect(response.status).toBe(400);
  });

  it("should return unauthorized error if token is missing", async () => {
    // Making the request without token
    const response = await request(app).post("/api/v1/todos").send();

    // Asserting the response
    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized request");
  });
});

describe("PATCH /api/v1/todos/:todoId", () => {
  it("should update a todo successfully", async () => {
    // Mock a successful update
    const mockTodoId = "existing_todo_id";
    const updatedTodo = {
      _id: mockTodoId,
      title: "Updated Title",
      description: "Updated Description",
    };
    todoService.updateTodo.mockResolvedValue(updatedTodo);

    const response = await request(app)
      .patch(`/api/v1/todos/${mockTodoId}`)
      .send(updatedTodo)
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200);
  });

  it("should return an error if todoId is missing", async () => {
    // Making the request with missing todoId
    const response = await request(app)
      .patch("/api/v1/todos/") // Corrected from .put to .patch
      .send({ title: "Updated Todo" })
      .set("Authorization", "Bearer valid_token");

    // Asserting the response
    expect(response.status).toBe(404);
  });
});

describe("GET /api/v1/todos/:todoId", () => {
  it("should fetch a todo successfully", async () => {
    // Mock a todo object
    const mockTodoId = "existing_todo_id";
    const mockTodo = {
      _id: mockTodoId,
      title: "Test Todo",
      description: "Test Description",
      user: "user_id",
    };

    // Mock the todoService.getTodoById function to return the mock todo
    todoService.getTodoById.mockResolvedValue(mockTodo);

    // Make the request to the endpoint
    const response = await request(app)
      .get(`/api/v1/todos/${mockTodoId}`)
      .set("Authorization", "Bearer valid_token");

    // Assert the response
    expect(response.status).toBe(200);
  });

  it("should return an error if todoId is not found", async () => {
    // Mock a non-existent todo object
    const nonExistentTodoId = "non_existent_todo_id";

    // Mock the todoService.getTodoById function to return null
    todoService.getTodoById.mockResolvedValue(null);

    // Make the request to the endpoint
    const response = await request(app)
      .get(`/api/v1/todos/${nonExistentTodoId}`)
      .set("Authorization", "Bearer valid_token");

    // Assert the response
    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/v1/todos/:todoId", () => {
  it("should delete a todo successfully", async () => {
    const mockTodoId = "existing_todo_id";

    // Mock the todoService.deleteTodo function
    todoService.deleteTodo.mockResolvedValue();

    // Make the request to delete the todo
    const response = await request(app)
      .delete(`/api/v1/todos/${mockTodoId}`)
      .set("Authorization", "Bearer valid_token");

    // Assert the response
    expect(response.status).toBe(200);
  });
});

describe("GET /api/v1/todos", () => {
  it("should fetch all todos for a user successfully", async () => {
    // Mock user ID
    const mockUserId = "user_id";

    // Mock todos
    const mockTodos = [
      {
        _id: "todo_id_1",
        title: "Todo 1",
        description: "Description 1",
        user: mockUserId,
      },
      {
        _id: "todo_id_2",
        title: "Todo 2",
        description: "Description 2",
        user: mockUserId,
      },
    ];

    // Mock the todoService.getTodosByUser function
    todoService.getTodosByUser.mockResolvedValue(mockTodos);

    // Make the request to fetch todos
    const response = await request(app)
      .get("/api/v1/todos")
      .set("Authorization", "Bearer valid_token");

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(mockTodos);
  });

  it("should return unauthorized error if token is missing", async () => {
    // Make the request without providing a token
    const response = await request(app).get("/api/v1/todos");

    // Assert the response
    expect(response.status).toBe(401);
    expect(response.text).toBe("Unauthorized request");
  });
});
