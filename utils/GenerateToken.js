const generateAccessAndRefreshTokens = async (userId, generateBoth = true) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    if (generateBoth) {
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      return { accessToken, refreshToken };
    }
    return { accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

module.exports = generateAccessAndRefreshTokens;
