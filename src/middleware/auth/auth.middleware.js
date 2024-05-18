const HttpStatus = require("http-status");
const { ErrorExceptionWithResponse } = require("../../exception/error.exception");
const UserService = require("../../service/user/user.service");
const userService = new UserService();
const JwtService = require("../../service/common/jwt.service");
const { MSG } = require("../../helper/constant");
const jwtService = new JwtService();
const ip = require('ip');

//-----------------------------------------------[ Check Token & find user ]-------------------------------------------------
// module.exports.authMiddleware = async (req, res, next) => {
//       try {
//             const token = req?.headers?.authorization?.split(" ")[1];
//             if (!token)
//                   throw new ErrorExceptionWithResponse(
//                         HttpStatus.BAD_REQUEST,
//                         true,
//                         MSG.TOKEN_EMPTY
//                   );

//             let { userId, role, ipAddress } = await jwtService.verifyToken(token);
//             if (ipAddress != ip.address())
//                   throw new ErrorExceptionWithResponse(
//                         HttpStatus.BAD_REQUEST,
//                         true,
//                         MSG.TOKEN_INVALID
//                   );

//             req.user = (await userService.getUserById(userId, role))?.result;
//             next();
//       }
//       catch (error) {
//             next(error);
//       }
// };

//-----------------------------------------------[ Check session & find user ]-------------------------------------------------
module.exports.authMiddleware = async (req, res, next) => {
      try {
            // Accessing currentUser from session
            const currentUser = req.session.currentUser;

            if (!currentUser)
                  throw new ErrorExceptionWithResponse(
                        HttpStatus.BAD_REQUEST,
                        true,
                        MSG.PLEASE_LOGIN
                  );

            let user = (await userService.getUserById(currentUser.id, currentUser.role))?.result;

            if (user) {
                  req.user = user;
                  return next();
            } else {
                  throw new ErrorExceptionWithResponse(
                        HttpStatus.BAD_REQUEST,
                        true,
                        MSG.PLEASE_REGISTER
                  );
            }
      }
      catch (error) {
            next(error);
      }
};

//-----------------------------------------------[ Check cookie & find user ]-------------------------------------------------
// module.exports.authMiddleware = async (req, res, next) => {
//       try {

//             // Accessing currentUser from cookie
//             const currentUser = req.cookies;

//             if (!currentUser)
//                   throw new ErrorExceptionWithResponse(
//                         HttpStatus.BAD_REQUEST,
//                         true,
//                         MSG.PLEASE_LOGIN
//                   );

//             let user = (await userService.getUserById(currentUser.userId, currentUser.userRole))?.result;

//             if (user) {
//                   req.user = user;
//                   return next();
//             } else {
//                   throw new ErrorExceptionWithResponse(
//                         HttpStatus.BAD_REQUEST,
//                         true,
//                         MSG.PLEASE_REGISTER
//                   );
//             }
//       }
//       catch (error) {
//             next(error);
//       }
// };


//-----------------------------------------------[ Check Role ]-------------------------------------------------
module.exports.checkRoleMiddleware = (allowRoles) => {
      return (req, res, next) => {
            try {
                  if (req.user && req.user.role && allowRoles.includes(req.user.role)) {
                        next();
                  }
                  else {
                        throw new ErrorExceptionWithResponse(
                              HttpStatus.BAD_REQUEST,
                              true,
                              MSG.NOT_ALLOW
                        );
                  }
            } catch (error) {
                  next(error);
            }
      }
};