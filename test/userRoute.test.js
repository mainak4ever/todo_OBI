const request = require("supertest");
const { app } = require("../app");
const { User } = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const userService = require("../sevices/user.service"); // Keeping "sevices" as per your folder name typo
const generateAccessAndRefreshTokens = require("../utils/GenerateToken");
const { auth } = require("../middlewares/auth.middleware");

jest.mock("../sevices/user.service"); // Mock userService module
jest.mock("../models/user.model", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(), // Add deleteMany mock
  },
}));
jest.mock("../utils/GenerateToken");

describe("POST /api/v1/users/register", () => {
  afterEach(async () => {
    await User.deleteMany(); // Clear the database after each test
  });

  it("should register a new user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    // Mock the userService.registerUser function to return a dummy user
    userService.registerUser.mockResolvedValue(userData);

    // Mock User.findOne to simulate user not existing
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/api/v1/users/register")
      .send(userData); // Make sure userData is correctly passed to the request

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: userData,
      message: "User registered successfully",
      statusCode: 200,
    });

    // Check if userService.registerUser was called with correct data
    expect(userService.registerUser).toHaveBeenCalledWith(userData);

    // Check if User.findOne was called with the correct email
    expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app).post("/api/v1/users/register").send({});

    expect(response.status).toBe(400);
    // expect(response.body).toEqual({
    //   statusCode: 400,
    //   message: "Please provide all the details",
    //   errors: [],
    // });
  });

  it("should return an error if user with the same email already exists", async () => {
    // Mock User.findOne to simulate user existing
    User.findOne.mockResolvedValue({});

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/v1/users/register")
      .send(userData);

    expect(response.status).toBe(409);
  });
});

describe("POST /api/v1/users/login", () => {
  it("should log in a user successfully", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
    };

    const mockUser = {
      _id: "user_id",
      email: userData.email,
      isPasswordCorrect: jest.fn().mockResolvedValue(true),
    };

    userService.getUserByEmail.mockResolvedValue(mockUser);
    generateAccessAndRefreshTokens.mockResolvedValue({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    });

    const response = await request(app)
      .post("/api/v1/users/login")
      .send(userData);

    expect(response.status).toBe(200);
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app).post("/api/v1/users/login").send({});

    expect(response.status).toBe(400);
  });

  it("should return an error if user is not found", async () => {
    userService.getUserByEmail.mockResolvedValue(null);

    const userData = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/v1/users/login")
      .send(userData);

    expect(response.status).toBe(404);
  });

  it("should return an error if password is incorrect", async () => {
    const userData = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    const mockUser = {
      _id: "user_id",
      email: userData.email,
      isPasswordCorrect: jest.fn().mockResolvedValue(false),
    };

    userService.getUserByEmail.mockResolvedValue(mockUser);

    const response = await request(app)
      .post("/api/v1/users/login")
      .send(userData);

    expect(response.status).toBe(401);
  });
});

jest.mock("../middlewares/auth.middleware", () => ({
  auth: jest.fn((req, res, next) => {
    if (req.headers.authorization === "Bearer valid_token") {
      // Assuming you have a user ID in the request for testing purposes
      req.user = { _id: "user_id" };
      next();
    } else {
      // Unauthorized request
      res.status(401).send("Unauthorized request");
    }
  }),
}));
describe("GET /api/v1/users/user", () => {
  it("should fetch user successfully", async () => {
    const mockUser = {
      _id: "user_id",
      name: "Test User",
      email: "test@example.com",
    };

    userService.getUserById.mockResolvedValue(mockUser);

    const authToken = "valid_token"; // Mock authentication token

    const response = await request(app)
      .get("/api/v1/users/user")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200); // Status 200 for successful user fetch
  });

  it("should return an error if user is not authenticated", async () => {
    const response = await request(app).get("/api/v1/users/user");

    expect(response.status).toBe(401); // Status 401 for unauthorized request
  });
});

describe("POST /api/v1/users/logout", () => {
  it("should log out a user successfully", async () => {
    const response = await request(app)
      .post("/api/v1/users/logout")
      .set("Authorization", "Bearer valid_token");

    expect(response.status).toBe(200); // Status 200 for successful logout
  });

  it("should return an error if user is not authenticated", async () => {
    const response = await request(app).post("/api/v1/users/logout");

    expect(response.status).toBe(401); // Status 401 for unauthorized request
  });
});
