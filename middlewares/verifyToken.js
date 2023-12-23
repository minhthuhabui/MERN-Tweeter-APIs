const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization) {
    const err = new Error("Unauthorized! Access token is missing.");
    err.statusCode = 401;
    return next(err);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { userId };
    next();
  } catch (error) {
    const err = new Error("Invalid access token");
    err.statusCode = 401;
    return next(err);
  }
};
