const HttpStatus = require("http-status");
const { generateOtp, successResponse, passwordEncrypt, passwordDecrypt } = require("../../utils/common.utils");
const { MSG } = require("../../helper/constant");
const { User } = require("../../model/user/user.model");
const { ErrorExceptionWithResponse } = require("../../exception/error.exception");
const JwtService = require("../common/jwt.service");
const { v4: uuidv4 } = require('uuid');
const EmailService = require("../common/email.service");
const { verfiyEmailRegistarionTemplate, forgetPasswordTemplate } = require("../../template/mail.template");
const ip = require('ip');

module.exports = class UserService {
      constructor() {
            this.userModel = User;
            this.jwtService = new JwtService();
            this.emailService = new EmailService();
      }

      //-----------------------------------------------[ Register ]----------------------------------------------
      async register(Body, file) {
            try {
                  if (file) {
                        Body.image = `http://${process.env.IP}:${process.env.PORT}/${file.path}`;
                  }

                  let user = await this.userModel.findOne({ email: Body.email });
                  if (user)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.EMAIL_ALREADY_IN_USE);

                  Body.createdAt = await new Date();
                  Body.otp = await generateOtp();
                  Body.password = await passwordEncrypt(Body.password);
                  Body.uuid = await uuidv4();
                  user = await this.userModel.create(Body);
                  user.createdBy = await user._id;
                  user = await user.save();
                  user.password = undefined;

                  //send registration email
                  await this.emailService.sendMail(user?.email, "Confirm Registration", verfiyEmailRegistarionTemplate(user));
                  console.log("Email sent successfully___________________________________________________");
                  return successResponse(HttpStatus.OK, false, MSG.REGISTER_SUCCESS, user);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }

      //-------------------------------------------[ Email Verify ]----------------------------------------------
      async emailVerify(params) {
            try {
                  let user = await this.userModel.findOne({ uuid: params.uuid });

                  if (!user)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_REGISTER);

                  if (user.isEmailVerify == true)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.EMAIL_ALREADY_VERIFY);

                  user.isEmailVerify = true;
                  await user.save();
                  return successResponse(HttpStatus.OK, false, MSG.EMAIL_VERIFY_SUCCESS);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }

      // -----------------------------------------------[ Login & jwt ]-------------------------------------------------
      // async login(Body) {
      //       try {
      //             let user = await this.userModel.findOne({ email: Body.email }).select('+password +isEmailVerify +role');

      //             if (!user || !user.password)
      //                   throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_REGISTER);

      //             if (!await (passwordDecrypt(Body.password, user.password)))
      //                   throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.WRONG_CREDENTIAL);

      //             if (user.isEmailVerify == false)
      //                   throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_VERIFY_EMAIL);

      //             let token = await this.jwtService.generateToken({ userId: user._id, role: user.role, ipAddress: ip.address() });
      //             user = {
      //                   ...user._doc,
      //                   token,
      //                   password: undefined
      //             };
      //             return successResponse(HttpStatus.OK, false, MSG.LOGIN_SUCCESS, user);
      //       }
      //       catch (error) {
      //             throw new ErrorExceptionWithResponse(
      //                   error.status || HttpStatus.BAD_REQUEST,
      //                   true,
      //                   error.message || MSG.INTERNAL_SERVER_ERROR
      //             );

      //       }
      // }

      //-----------------------------------------------[ Login & session ]-------------------------------------------------
      async login(session, Body) {
            try {
                  let user = await this.userModel.findOne({ email: Body.email }).select('+password +isEmailVerify +role');

                  if (!user || !user.password)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_REGISTER);

                  if (!await (passwordDecrypt(Body.password, user.password)))
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.WRONG_CREDENTIAL);

                  if (user.isEmailVerify == false)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_VERIFY_EMAIL);

                  session.currentUser = {
                        id: user._id,
                        role: user.role,
                  };
                  return successResponse(HttpStatus.OK, false, MSG.LOGIN_SUCCESS, user);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }

      //-----------------------------------------------[ Login & cookie ]-------------------------------------------------
      // async login(res, Body) {
      //       try {
      //             let user = await this.userModel.findOne({ email: Body.email }).select('+password +isEmailVerify +role');

      //             if (!user || !user.password)
      //                   throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_REGISTER);

      //             if (!await (passwordDecrypt(Body.password, user.password)))
      //                   throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.WRONG_CREDENTIAL);

      //             if (user.isEmailVerify == false)
      //                   throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PLEASE_VERIFY_EMAIL);

      //             // Set cookies directly
      //             res.cookie('userId', user.id, { maxAge: 900000, httpOnly: true });
      //             res.cookie('userRole', user.role, { maxAge: 900000, httpOnly: true });
      //             return successResponse(HttpStatus.OK, false, MSG.LOGIN_SUCCESS, user);
      //       }
      //       catch (error) {
      //             throw new ErrorExceptionWithResponse(
      //                   error.status || HttpStatus.BAD_REQUEST,
      //                   true,
      //                   error.message || MSG.INTERNAL_SERVER_ERROR
      //             );

      //       }
      // }

      //------------------------------------------[ Change Password ]--------------------------------------------
      async changePassword(user, Body) {
            try {

                  let findUser = await this.userModel.findOne({ _id: user._id }).select("+password");

                  if (!findUser)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.USER_NOT_FOUND);

                  if (!await passwordDecrypt(Body.oldPassword, findUser.password))
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.OLD_PASSSWORD_NOT_MATCH);


                  if (Body.oldPassword == Body.newPassword)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.SAME_PASSSWORD);

                  findUser.password = await passwordEncrypt(Body.newPassword);
                  await findUser.save();

                  return successResponse(HttpStatus.OK, false, MSG.PASSWORD_CHANGE_SUCCESS);

            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }

      //---------------------------------------[ Forget Password Email ]-----------------------------------------
      async forgetPassword(Body) {
            try {
                  let findUser = await this.userModel.findOne({ email: Body.email });

                  if (!findUser)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.USER_NOT_FOUND);

                  //send forget password mail
                  await this.emailService.sendMail(findUser?.email, "Forget Password Email", forgetPasswordTemplate(findUser));

                  return successResponse(HttpStatus.OK, false, MSG.EMAIL_SEND_SUCCESS);

            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }

      //---------------------------------------  [ Reset Password ]----------------------------------------------
      async resetPassword(params, Body) {
            try {
                  let user = await this.userModel.findOne({ uuid: params.uuid });

                  if (!user)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.USER_NOT_FOUND);

                  if (Body.newPassword != Body.confirmPassword)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.PASSSWORD_NOT_MATCH);

                  user.password = await passwordEncrypt(Body.newPassword);
                  await user.save();

                  return successResponse(HttpStatus.OK, false, MSG.PASSWORD_RESET_SUCCESS);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }

      //---------------------------------------  [ Profile ]----------------------------------------------
      async profile(user) {
            try {
                  let findUser = await this.userModel.findOne({ _id: user._id });
                  if (!findUser)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.USER_NOT_FOUND);

                  return successResponse(HttpStatus.OK, false, MSG.FOUND_SUCCESS, findUser);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }

      //---------------------------------------  [ Update Profile ]----------------------------------------------
      async updateProfile(user, Body, file) {
            try {
                  if (file) {
                        Body.image = `http://${process.env.IP}:${process.env.PORT}/${file.path}`;
                  }
                  Body.updatedAt = new Date();
                  let findUser = await this.userModel.findOneAndUpdate(user._id, Body, { new: true });
                  if (!findUser)
                        throw new ErrorExceptionWithResponse(HttpStatus.BAD_REQUEST, true, MSG.USER_NOT_FOUND);

                  return successResponse(HttpStatus.OK, false, MSG.UPDATE_SUCCESS, findUser);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }


      //---------------------------------------  [ Get user by Id from token]----------------------------------------------
      async getUserById(userId, role) {
            try {
                  let findUser = await this.userModel.findOne({ _id: userId, role: role }).select('+password');
                  //user not exist
                  if (!findUser || findUser.isDelete == true || !findUser.password)
                        throw new ErrorExceptionWithResponse(
                              HttpStatus.BAD_REQUEST,
                              true,
                              MSG.PLEASE_REGISTER
                        );

                  return successResponse(HttpStatus.OK, false, MSG.FOUND_SUCCESS, findUser);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }

      //---------------------------------------  [ logout ]----------------------------------------------
      // async logOut(res) {
      //       try {
      //             await res.clearCookie('userId');
      //             await res.clearCookie('userRole');
      //             return successResponse(HttpStatus.OK, false, MSG.LOGOUT_SUCCESS);
      //       }
      //       catch (error) {
      //             throw new ErrorExceptionWithResponse(
      //                   error.status || HttpStatus.BAD_REQUEST,
      //                   true,
      //                   error.message || MSG.INTERNAL_SERVER_ERROR
      //             );
      //       }
      // }

      //---------------------------------------  [ logout session]----------------------------------------------
      async logOut(session) {
            try {
                  console.log(session)
                  await session.destroy();
                  return successResponse(HttpStatus.OK, false, MSG.LOGOUT_SUCCESS);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );
            }
      }


      //-----------------------------------------------[ Login  ]-------------------------------------------------
      async googleLogin(user, Body) {
            try {
                  let user = await this.userModel.findOne({ email: Body.email });


                  session.currentUser = {
                        id: user._id,
                        role: user.role,
                  };
                  return successResponse(HttpStatus.OK, false, MSG.LOGIN_SUCCESS, user);
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.BAD_REQUEST,
                        true,
                        error.message || MSG.INTERNAL_SERVER_ERROR
                  );

            }
      }
}