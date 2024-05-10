class ErrorException extends Error {
      constructor(message) {
            super(message, 400);
      }
}

class ErrorExceptionWithResponse extends Error {
      constructor(statusCode, error, message) {
            super(message, statusCode);
            this.error = error;
            this.statusCode = statusCode;
      }
}

module.exports = { ErrorException, ErrorExceptionWithResponse };
