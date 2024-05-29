const bcrypt = require("bcrypt");
const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const { MSG } = require("../helper/constant");
const fs = require("fs");
const csv = require("csv-parser");
const httpStatus = require("http-status");

//-----------------------------------------------[ Success Response ]-----------------------------------------------
module.exports.successResponse = (statusCode, error, message, result) => {
  return {
    statusCode,
    error,
    message,
    result,
  };
};
//-----------------------------------------------[ Success Response With Count ]-----------------------------------------------
module.exports.successResponseWithCount = (
  statusCode,
  error,
  message,
  result,
  total
) => {
  return {
    statusCode,
    error,
    message,
    result,
    total,
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
module.exports.generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//---------------------------------------------  [ Delete file  ] ------------------------------------------------
module.exports.deleteFile = async (filePath) => {
  await fs.promises.unlink(filePath);
};

//--------------------------  [ extract public id from the cloudinary image url  ] -------------------------------
module.exports.extractPublicIdFromImageUrl = (imageUrl) => {
  return imageUrl.split("/").pop().split(".").slice(0, -1).join(".");
};

//----------------------------------------  [ parsed csv file  ] ------------------------------------------------S
module.exports.validateCsvFile = async (file, schema) => {
  const results = [];
  // Read uploaded CSV file and parse it
  await new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csv({ separator: "," }))
      .on("data", (data) => results.push(data))
      .on("end", resolve)
      .on("error", reject);
  });

  // Validate CSV data
  for (const row of results) {
    row.isAvailable = row.isAvailable === "TRUE";
    const { error } = schema.validate(row);
    if (error) {
      throw new ErrorExceptionWithResponse(
        httpStatus.BAD_REQUEST,
        true,
        MSG.INVALID_CSV
      );
    }
  }

  // Return the parsed CSV data
  return results;
};
