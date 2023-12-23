const express = require("express");
const {
  login,
  register,
  getCurrentUser,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");
const { refreshToken } = require("../middlewares/refreshToken");

const Router = express.Router();

Router.route("/register").post(register);
Router.route("/login").post(login);
Router.route("/").get(verifyToken, getCurrentUser);
// Router.route("/refresh-token").post(refreshToken);

module.exports = Router;
