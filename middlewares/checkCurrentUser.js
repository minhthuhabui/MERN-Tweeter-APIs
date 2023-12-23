const jwt = require("jsonwebtoken");

exports.checkCurrentUser = async (req, res, next) => {
  const authorization = req.header("authorization");

  if (!authorization) {
    req.user = null;
    next();
  } else {
    const token = authorization.replace("Bearer ", "");

    try {
      const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = { userId };
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
};
