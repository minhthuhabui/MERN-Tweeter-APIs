const express = require("express");
const {
  getAllPosts,
  createOnePost,
  updateOnePost,
  deleteOnePost,
} = require("../controllers/postController.js");

const { verifyToken } = require("../middlewares/verifyToken");

const Router = express.Router();

// Public routes
Router.route("/").get(getAllPosts);

// Protected routes (require authentication)
Router.route("/").post(verifyToken, createOnePost);
Router.route("/:postId")
  .put(verifyToken, updateOnePost)
  .delete(verifyToken, deleteOnePost);

module.exports = Router;
