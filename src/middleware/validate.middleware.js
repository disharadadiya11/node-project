// Middleware function for validating request body against Joi schema
module.exports.validateSchema = (schema, property) => {
      return (req, res, next) => {
            try {
                  const { error } = schema.validate(req[property]);
                  if (error) {
                        return res.status(400).json({ error: error.details[0].message });
                  }
                  next();
            }
            catch (error) {
                  throw new ErrorExceptionWithResponse(
                        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                        true,
                        error.message
                  );
            }
      };
}


