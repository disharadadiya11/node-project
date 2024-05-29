const Joi = require("joi");

//---------------------------------------  [ Register ]----------------------------------------------
module.exports.userRegisterJoiValidation = Joi.object({
  name: Joi.string().replace(/\s+/g, " ").required().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  email: Joi.string().email().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  password: Joi.string().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  image: Joi.string().optional(),
});

//---------------------------------------  [ Login ]----------------------------------------------
module.exports.userLoginJoiValidation = Joi.object({
  email: Joi.string().email().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  password: Joi.string().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
});

//---------------------------------------  [ Change Password ]----------------------------------------------
module.exports.userChangePasswordJoiValidation = Joi.object({
  oldPassword: Joi.string().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  newPassword: Joi.string().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
});

//---------------------------------------  [ Profile ]----------------------------------------------
module.exports.userForgetPasswordJoiValidation = Joi.object({
  email: Joi.string().email().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
});

//---------------------------------------  [ Reset Password ]----------------------------------------------
module.exports.userResetPasswordJoiValidation = Joi.object({
  newPassword: Joi.string().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  confirmPassword: Joi.string().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
});

//---------------------------------------  [ Update Profile ]----------------------------------------------
module.exports.userUpdateProfileJoiValidation = Joi.object({
  name: Joi.string().replace(/\s+/g, " ").optional().trim().messages({
    "string.empty": "{{#label}} is not allowed to be empty.. !!",
    "any.required": "{{#label}} is required!!",
  }),
  image: Joi.string().optional(),
});
