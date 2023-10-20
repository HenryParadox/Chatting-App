const joi = require("joi");

const userLoginValidate = joi.object().keys({
  email: joi.string().email().required().messages({
    "any.required": "Email field is required",
    "string.email": `Please enter valid Email Id`,
  }),
  password: joi.string().min(4).required().messages({
    "any.required": "Password field is required",
    "string.min": "Password field must have minimum 4 characters",
  }),
});

module.exports = userLoginValidate;
