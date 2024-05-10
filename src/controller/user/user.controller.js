const UserService = require("../../service/user/user.service")
const service = new UserService();

//-----------------------------------------------[ Register ]-------------------------------------------------
module.exports.Register = {
      controller: async (req, res, next) => {
            try {

                  const result = await service.register(req.body, req.file);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Login & jwt ]-------------------------------------------------
// module.exports.Login = {
//       controller: async (req, res, next) => {
//             try {
//                   const result = await service.login(req.body);
//                   return res.status(result.statusCode).send(result);
//             }
//             catch (error) {
//                   next(error);
//             }
//       }
// };

//-----------------------------------------------[ Login & session ]-------------------------------------------------
module.exports.Login = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.login(req.session, req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Login & cookie ]-------------------------------------------------
// module.exports.Login = {
//       controller: async (req, res, next) => {
//             try {
//                   const result = await service.login(res, req.body);
//                   return res.status(result.statusCode).send(result);
//             }
//             catch (error) {
//                   next(error);
//             }
//       }
// };

//-----------------------------------------------[ Email Verify ]-------------------------------------------------
module.exports.EmailVerify = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.emailVerify(req.params);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Change Password ]-------------------------------------------------
module.exports.ChangePassword = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.changePassword(req.user, req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Forget Password ]-------------------------------------------------
module.exports.ForgetPassword = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.forgetPassword(req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Reset Password ]-------------------------------------------------
module.exports.ResetPassword = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.resetPassword(req.params, req.body);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ User Profile ]-------------------------------------------------
module.exports.Profile = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.profile(req.user);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ User Update Profile ]-------------------------------------------------
module.exports.UpdateProfile = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.updateProfile(req.user, req.body, req.file);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ User Logout cookie]-------------------------------------------------
module.exports.Logout = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.logOut(res);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ User Logout session ]-------------------------------------------------
module.exports.Logout = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.logOut(req.session);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};

//-----------------------------------------------[ Google Login ]-------------------------------------------------
module.exports.GoogleLogin = {
      controller: async (req, res, next) => {
            try {
                  const result = await service.googleLogin(req.user);
                  return res.status(result.statusCode).send(result);
            }
            catch (error) {
                  next(error);
            }
      }
};