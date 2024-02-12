const conf = require("../conf");
const { User } = require("../models/user.model");
const { userService } = require("../sevices");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const generateAccessAndRefreshTokens = require("../utils/GenerateToken");
const { asyncHandler } = require("../utils/asyncHandler");

const options = {
  // httpOnly: true,
  secure: true,
  // domain: conf.CORS_ORIGIN || conf.LOCAL_CORS_ORIGIN,
};

// register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide all the details");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with username or email already exists");
  }

  const createdUser = await userService.registerUser(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Please provide all the details");
  }

  const user = await userService.getUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }
  // console.log("Retrieved user:", user);

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: user,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

//refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const { accessToken } = await generateAccessAndRefreshTokens(
      user._id,
      false
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, incomingRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

//get User
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Fetched successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUser,
};
