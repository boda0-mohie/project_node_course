const appError = require("../utilities/appError");

module.exports = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.currentUser.role)) {
      return next(appError.create("This Role is not Authorized", 401));
    }
    next();
  };
};
