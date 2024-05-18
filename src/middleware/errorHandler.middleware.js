const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const { MSG } = require("../helper/constant");
const multer = require("multer");
const HttpStatus = require("http-status");


module.exports.errorHandleMidlleware = (err, req, res, next) => {
      console.log(err)
      if (err instanceof multer.MulterError) {
            return res.status(400).send(err.message);
      }
      else if (err instanceof ErrorExceptionWithResponse) {
            return res.status(err.statusCode).send({
                  statusCode: err.statusCode,
                  error: err.error || true,
                  message: err.message || MSG.HANDLING_ERROR_EXCEPTION,
            });
      }
      else {
            return res.status(err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).send({
                  statusCode: err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
                  error: true,
                  message: err.message || MSG.INTERNAL_SERVER_ERROR,
            });
      }

};