const bcrypt = require("bcrypt");
const fs = require("fs");
//-----------------------------------------------[ Success Response ]-----------------------------------------------
module.exports.successResponse = (statusCode, error, message, result) => {
  return {
    statusCode,
    error,
    message,
    result,
  };
};

//-----------------------------------------------[ Error Response ]-------------------------------------------------
module.exports.errorResponse = (statusCode, error, message, result) => {
  return {
    statusCode,
    error,
    message,
    result,
  };
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

//---------------------------------------------  [ Delete file  ] ------------------------------------------------
module.exports.deleteFile = async (filePath) => {
  await fs.promises.unlink(filePath);
};

//---------------------------------------------  [ Delete file  ] ------------------------------------------------
module.exports.extractPublicIdFromImageUrl = async (imageUrl) => {
  return imageUrl.split("/").pop().split(".").slice(0, -1).join(".");
};
