const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utilities/users.roles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: [validator.isEmail, "This Field Is Requre"],
  },
  password: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANGER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "uploads/team-01.png"
  }
});

module.exports = mongoose.model("User", userSchema);
