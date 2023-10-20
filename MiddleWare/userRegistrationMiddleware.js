const userRegisterValidate = require("../Validation/registrationValidation");
const { errorResponse } = require("../Config/responseMsg");

const userRegisterValidateMiddleWare = (req, res, next) => {
  const validationResult = userRegisterValidate.validate(req.body, {
    abortEarly: false,
  });
  if (validationResult.error) {
    errMessage = validationResult.error.details[0].message;
    res.send(errorResponse(errMessage));
  } else {
    next();
  }
};

module.exports = userRegisterValidateMiddleWare;
