const jwt = require("jsonwebtoken");
const appError = require("../utilities/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  if (!authHeader) {
    const error = appError.create("Token Is Required", 401, "error");
    return next(error);
  }
  const token = authHeader.split(" ")[1];

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = appError.create("Inalid Token", 401, "error");
    return next(error);
  }
};

module.exports = verifyToken;
