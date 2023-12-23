const express = require("express");
const {
  login,
  register,
  getCurrentUser,
  refreshToken,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken");
// const { refreshToken } = require("../middlewares/refreshToken");

const Router = express.Router();

Router.route("/register").post(register);
Router.route("/refresh-token").post(refreshToken);

Router.route("/login").post(login);
Router.route("/").get(verifyToken, getCurrentUser);

module.exports = Router;
