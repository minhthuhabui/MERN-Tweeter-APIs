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

// Import Error Handler
const { errorHandler } = require("./middlewares/errorHandler");

const { register } = require("./controllers/authController");
const app = express();

// Cors
app.use(cors());

//Body Parser
app.use(express.json());

// Mount the route
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/posts", postRoute);

// Unhandled Route
app.all("*", (req, res, next) => {
  const err = new Error("The route can not be found");
  err.statusCode = 404;
  next(err);
});
app.use(errorHandler);

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
