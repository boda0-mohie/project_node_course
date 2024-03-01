const User = require("../models/models.users");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utilities/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateJWt = require("../utilities/geneainJWT");

const getUsers = asyncWrapper(async (req, res) => {
  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: "success", data: users });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create("User Already Exist", 400, "fail");
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  const token = await generateJWt({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });

  newUser.token = token;

  await newUser.save();
  res.status(201).json({ status: "success", data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create("Password And Email Is Requird", 400, "fail");
    return next(error);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const error = appError.create("User Not Found", 400, "fail");
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    const token = await generateJWt({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.json({ status: "success", data: { token: token } });
  } else {
    const error = appError.create("Something Wrong", 400, "fail");
    return next(error);
  }
});

module.exports = {
  getUsers,
  register,
  login,
};
