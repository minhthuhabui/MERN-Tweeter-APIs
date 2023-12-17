const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  // Access Authorization from req header
  const Authorization = req.header("authorization");
  if (!Authorization) {
    const err = new Error("Unauthorized!");
    err.statusCode = 400;
    return next(err);
  }

  // Get Token
  // Bearer + token key(1asfassfaasas)
  const token = Authorization.replace("Bearer ", "");
  // console.log(token);

  //Verify token
  const { userId } = jwt.verify(token, process.env.APP_SECRET);
  // console.log(process.env.APP_SECRET);
  // Assign req
  req.user = { userId };

  next();
};
