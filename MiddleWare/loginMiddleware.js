const userLoginValidate = require("../Validation/loginValidation");
const { errorResponse } = require("../Config/responseMsg");

const userLoginValidateMiddleWare = (req, res, next) => {
  const validationResult = userLoginValidate.validate(req.body, {
    abortEarly: false,
  });
  if (validationResult.error) {
    errMessage = validationResult.error.details[0].message;
    res.send(errorResponse(errMessage));
  } else {
    next();
  }
};

module.exports = userLoginValidateMiddleWare;
