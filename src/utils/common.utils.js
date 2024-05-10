const bcrypt = require('bcrypt');

//-----------------------------------------------[ Success Response ]-----------------------------------------------
module.exports.successResponse = (statusCode, error, message, result) => {
      return {
            statusCode, error, message, result
      }
};

//-----------------------------------------------[ Error Response ]-------------------------------------------------
module.exports.errorResponse = (statusCode, error, message, result) => {
      return {
            statusCode, error, message, result
      }
};

//-----------------------------------------[ Password Encrypt/Decrypt  ]--------------------------------------------
module.exports.passwordEncrypt = async (password) => {
      return await bcrypt.hash(password, 10);
};

module.exports.passwordDecrypt = async (password, userPassword) => {
      return bcrypt.compareSync(password, userPassword);
};

//-----------------------------------------------[ Generate Otp  ]-------------------------------------------------
module.exports.generateOtp = async () => {
      return Math.floor(100000 + Math.random() * 900000);
};