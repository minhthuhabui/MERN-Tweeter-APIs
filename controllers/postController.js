const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Get All Posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name")
      .select("content createdAt");
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

// Create One Post
exports.createOnePost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const post = await Post.create({ ...req.body, author: userId });
    res.status(200).json({
      status: "success",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

// Update One Post
exports.updateOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      const error = new Error("You do not have permission to update this post");
      error.statusCode = 403;
      throw error;
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: { post: updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

// Delete One Post
exports.deleteOnePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    // Check if the user is the author of the post
    if (post.author.toString() !== req.user.userId) {
      const error = new Error("You do not have permission to delete this post");
      error.statusCode = 403;
      throw error;
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      status: "success",
      message: "Post has been deleted",
    });
  } catch (error) {
    next(error);
  }
};
