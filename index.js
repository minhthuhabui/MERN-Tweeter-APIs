//dotenv
require("dotenv").config();
//Connect DB
const connectDB = require("./configs/db");

connectDB();

const express = require("express");
const cors = require("cors");

// Import Routes
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");

// Import Middleware
const { verifyToken } = require("./middlewares/verifyToken");
const { refreshToken } = require("./middlewares/refreshToken");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Cors
app.use(cors());

// Body Parser
app.use(express.json());

// Mount the routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", verifyToken, postRoute);
app.use("/api/v1/refresh-token", refreshToken); // Route for refreshing access tokens

// Unhandled Route
app.all("*", (req, res, next) => {
  const err = new Error("The route can not be found");
  err.statusCode = 404;
  next(err);
});

// Error handler middleware
app.use(errorHandler);

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
