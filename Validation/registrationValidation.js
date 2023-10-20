const joi = require("joi");

const userRegisterValidate = joi.object().keys({
  name: joi.string().min(3).required().messages({
    "any.required": "Name field is required",
    "string.min": "Name field must have minimum 3 characters",
  }),
  email: joi.string().email().required().messages({
    "any.required": "Email field is required",
    "string.email": `Please enter valid Email Id`,
  }),
  password: joi.string().min(4).required().messages({
    "any.required": "Password field is required",
    "string.min": "Password field must have minimum 4 characters",
  }),
  token: joi.string().messages({
    "any.required": "Token field is required",
  }),
});

module.exports = userRegisterValidate;
