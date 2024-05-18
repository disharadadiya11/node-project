const Joi = require("joi");

//-----------------------------------------------[ Create Subject ]-------------------------------------------------
module.exports.createSubjectJoiValidation = Joi.object({
      name: Joi.string().replace(/\s+/g, ' ').required().trim()
            .messages({
                  "string.empty": "{{#label}} is not allowed to be empty.. !!",
                  "any.required": "{{#label}} is required!!",
            }),
      isAvailable: Joi.boolean().optional()

});


//-----------------------------------------------[ Update Subject ]-------------------------------------------------
module.exports.updateSubjectJoiValidation = Joi.object({
      name: Joi.string().replace(/\s+/g, ' ').optional().trim()
            .messages({
                  "string.empty": "{{#label}} is not allowed to be empty.. !!",
                  "any.required": "{{#label}} is required!!",
            }),
      isAvailable: Joi.boolean().optional()

});