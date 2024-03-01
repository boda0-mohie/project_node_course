const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Title Is Required")
      .isLength({ min: 2 })
      .withMessage("At Least 2 Digits"),
    body("price")
    .notEmpty()
    .withMessage("Price Is Required"),
  ];
};


module.exports = {
  validationSchema
}