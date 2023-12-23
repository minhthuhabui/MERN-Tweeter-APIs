const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const err = new Error("Unauthorized! Refresh token is missing.");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.userId, refreshToken });

    if (!user) {
      const err = new Error("Invalid refresh token");
      err.statusCode = 401;
      return next(err);
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15m", // Adjust expiration time as needed
      }
    );

    req.user = { userId: user._id, newAccessToken };
    next();
  } catch (error) {
    const err = new Error("Invalid refresh token");
    err.statusCode = 401;
    return next(err);
  }
};
