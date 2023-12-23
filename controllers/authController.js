const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate an access token with a shorter expiration time (e.g., 15 minutes)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

// Generate a refresh token with a longer expiration time (e.g., 7 days)
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token in the user document (you may want to store it securely)
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
        userName: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log("login here");
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      const err = new Error("Email or password is not correct");
      err.statusCode = 400;
      return next(err);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    console.log("User:", user); // Add this line to log user details

    // Save refresh token in the user document (you may want to store it securely)
    user.refreshToken = refreshToken;
    await user.save();

    console.log("Access Token:", accessToken); // Add this line to log access token
    console.log("Refresh Token:", refreshToken); // Add this line to log refresh token

    res.status(200).json({
      status: "success",
      data: {
        accessToken,
        refreshToken,
        userName: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.userId, refreshToken });

    if (!user) {
      const err = new Error("Invalid refresh token");
      err.statusCode = 401;
      return next(err);
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      status: "success",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Remove the refresh token from the user document to invalidate it
    req.user.refreshToken = null;
    await req.user.save();

    res.status(200).json({
      status: "success",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const data = { user: null };
    if (req.user) {
      const user = await User.findOne({ _id: req.user.userId });
      data.user = { userName: user.name };
    }
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
