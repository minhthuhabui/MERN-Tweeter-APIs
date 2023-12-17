const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Name must be required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email must be required"],
    },
    password: {
      type: String,
      required: [true, "Password must be required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

// Hash password truoc khi luu vao database
userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) {
      return next(error);
    } else {
      user.password = hash;
      next();
    }
  });
});

// Create model User
const User = mongoose.model("User", userSchema);

module.exports = User;
