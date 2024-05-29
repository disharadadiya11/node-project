const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  EmailVerify,
  ChangePassword,
  ForgetPassword,
  ResetPassword,
  Profile,
  UpdateProfile,
  GoogleLogin,
  Logout,
  RemoveProfile,
} = require("../controller/user/user.controller");
const { validateSchema } = require("../middleware/validate.middleware");
const {
  userRegisterJoiValidation,
  userLoginJoiValidation,
  userChangePasswordJoiValidation,
  userForgetPasswordJoiValidation,
  userResetPasswordJoiValidation,
  userUpdateProfileJoiValidation,
} = require("../validation/user/user.validation");
const MulterService = require("../service/common/multer.service");
const multerService = new MulterService();
const passport = require("../strategy/google.strategy");

//user registration
router.post(
  "/register",
  multerService.singleImageOrFileUpload("image"),
  validateSchema(userRegisterJoiValidation, "body"),
  Register.controller
);

//user login
router.post(
  "/login",
  validateSchema(userLoginJoiValidation, "body"),
  Login.controller
);

//user email verify
router.get("/emailVerify/:uuid", EmailVerify.controller);

//user password change
router.post(
  "/changePassword",
  validateSchema(userChangePasswordJoiValidation, "body"),
  ChangePassword.controller
);

//user forget-password
router.post(
  "/forgetPassword",
  validateSchema(userForgetPasswordJoiValidation, "body"),
  ForgetPassword.controller
);

//user reset-password
router.post(
  "/resetPassword/:uuid",
  validateSchema(userResetPasswordJoiValidation, "body"),
  ResetPassword.controller
);

//user profile
router.get("/profile", Profile.controller);

//user delete profile
router.delete("/removeprofile", RemoveProfile.controller);

//user update profile
router.put(
  "/updateProfile",
  multerService.singleImageOrFileUpload("image"),
  validateSchema(userUpdateProfileJoiValidation, "body"),
  UpdateProfile.controller
);

// Google Authentication Route
router.post("/logout", Logout.controller);

// Google Authentication Route
// router.get('/google', passport.authenticate('google'));

// router.get('/google/login', passport.authenticate('google'), GoogleLogin.controller);

module.exports = router;
