const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
    email: {
      type: String,
      require: true,
      unique: [true, "This email is already present"],
    },
    password: {
      type: String,
      required: [true, "Please enter strong password"],
      minlength: 4,
    },
    image: {
      type: String,
      required: true,
    },
    is_online: {
      type: String,
      default: "0",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

module.exports = User;
