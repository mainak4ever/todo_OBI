const { User } = require("../models/user.model");
const { ApiError } = require("../utils/ApiError");

// Create operation
const registerUser = async (reqBody) => {
  try {
    const user = await User.create(reqBody);
    return user;
  } catch (error) {
    throw new ApiError(400, "Something went wrong while creating the account.");
  }
};

// Read operation
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return user;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

// Update operation
const updateUser = async (userId, updateBody) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updateBody, {
      new: true,
    });
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return user;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

// Delete operation
const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return user;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found.");
    }
    return user;
  } catch (error) {
    throw new ApiError(500, "Internal server error.");
  }
};

module.exports = {
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
};
