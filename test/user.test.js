const {
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("../sevices/user.service");
const { User } = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");

// Mocking User model
jest.mock("../models/user.model", () => ({
  User: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  },
}));

// Mocking ApiError class
jest.mock("../utils/ApiError", () => ({
  ApiError: jest.fn(),
}));

describe("registerUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };
    const user = { ...userData, _id: "someUserId" };

    User.create.mockResolvedValue(user);

    const result = await registerUser(userData);

    expect(User.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(user);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError if user creation fails", async () => {
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };
    const errorMessage = "Something went wrong while creating the account.";
    const error = new Error(errorMessage);

    User.create.mockRejectedValue(error);

    try {
      await registerUser(userData);
    } catch (error) {
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(ApiError).toHaveBeenCalledWith(400, errorMessage);
    }
  });
});

describe("getUserById", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the user if found", async () => {
    const userId = "someUserId";
    const user = {
      _id: userId,
      username: "testuser",
      email: "test@example.com",
    };

    User.findById.mockResolvedValue(user);

    const result = await getUserById(userId);

    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(user);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if user is not found", async () => {
    const userId = "nonExistentUserId";

    User.findById.mockResolvedValue(null);

    try {
      await getUserById(userId);
    } catch (error) {
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(ApiError).toHaveBeenCalledWith(404, "User not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const userId = "someUserId";
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    User.findById.mockRejectedValue(error);

    try {
      await getUserById(userId);
    } catch (error) {
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});

describe("updateUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update user successfully", async () => {
    const userId = "someUserId";
    const updateBody = { username: "newUsername" };
    const updatedUser = {
      _id: userId,
      username: "newUsername",
      email: "test@example.com",
    };

    User.findByIdAndUpdate.mockResolvedValue(updatedUser);

    const result = await updateUser(userId, updateBody);

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateBody, {
      new: true,
    });
    expect(result).toEqual(updatedUser);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if user is not found", async () => {
    const userId = "nonExistentUserId";
    const updateBody = { username: "newUsername" };

    User.findByIdAndUpdate.mockResolvedValue(null);

    try {
      await updateUser(userId, updateBody);
    } catch (error) {
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateBody, {
        new: true,
      });
      expect(ApiError).toHaveBeenCalledWith(404, "User not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const userId = "someUserId";
    const updateBody = { username: "newUsername" };
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    User.findByIdAndUpdate.mockRejectedValue(error);

    try {
      await updateUser(userId, updateBody);
    } catch (error) {
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateBody, {
        new: true,
      });
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});

describe("deleteUser", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should delete user successfully", async () => {
    const userId = "someUserId";
    const deletedUser = {
      _id: userId,
      username: "testuser",
      email: "test@example.com",
    };

    User.findByIdAndDelete.mockResolvedValue(deletedUser);

    const result = await deleteUser(userId);

    expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
    expect(result).toEqual(deletedUser);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if user is not found", async () => {
    const userId = "nonExistentUserId";

    User.findByIdAndDelete.mockResolvedValue(null);

    try {
      await deleteUser(userId);
    } catch (error) {
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(ApiError).toHaveBeenCalledWith(404, "User not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const userId = "someUserId";
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    User.findByIdAndDelete.mockRejectedValue(error);

    try {
      await deleteUser(userId);
    } catch (error) {
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});

describe("getUserByEmail", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the user if found by email", async () => {
    const email = "test@example.com";
    const user = { _id: "someUserId", username: "testuser", email };

    User.findOne.mockResolvedValue(user);

    const result = await getUserByEmail(email);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(result).toEqual(user);
    expect(ApiError).not.toHaveBeenCalled();
  });

  it("should throw an ApiError with status 404 if user is not found by email", async () => {
    const email = "nonExistent@example.com";

    User.findOne.mockResolvedValue(null);

    try {
      await getUserByEmail(email);
    } catch (error) {
      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(ApiError).toHaveBeenCalledWith(404, "User not found.");
    }
  });

  it("should throw an ApiError with status 500 for internal server errors", async () => {
    const email = "test@example.com";
    const errorMessage = "Internal server error.";
    const error = new Error(errorMessage);

    User.findOne.mockRejectedValue(error);

    try {
      await getUserByEmail(email);
    } catch (error) {
      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(ApiError).toHaveBeenCalledWith(500, errorMessage);
    }
  });
});
