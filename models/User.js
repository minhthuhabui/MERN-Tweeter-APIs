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
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving to the database
userSchema.pre("save", async function (next) {
  try {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) {
      return next();
    }

    // Hash the password
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Create model User
const User = mongoose.model("User", userSchema);

module.exports = User;
