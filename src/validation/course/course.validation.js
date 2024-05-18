const Joi = require('joi');

//-----------------------------------------------[ Create Course ]-------------------------------------------------
module.exports.createCourseJoiValidation = Joi.object({
      name: Joi.string().replace(/\s+/g, ' ').required().trim()
            .messages({
                  "string.empty": "{{#label}} is not allowed to be empty.. !!",
                  "any.required": "{{#label}} is required!!",
            }),
      price: Joi.number().required()
            .messages({
                  "string.empty": "{{#label}} is not allowed to be empty.. !!",
                  "any.required": "{{#label}} is required!!",
            }),
      images: Joi.string().optional(),
      isAvailable: Joi.boolean().optional()

});

//-----------------------------------------------[ Update Course ]-------------------------------------------------
module.exports.updateCourseJoiValidation = Joi.object({
      name: Joi.string().replace(/\s+/g, ' ').optional().trim()
            .messages({
                  "string.empty": "{{#label}} is not allowed to be empty.. !!",
                  "any.required": "{{#label}} is required!!",
            }),
      price: Joi.number().optional()
            .messages({
                  "string.empty": "{{#label}} is not allowed to be empty.. !!",
                  "any.required": "{{#label}} is required!!",
            }),
      images: Joi.string().optional(),
      isAvailable: Joi.boolean().optional()
});

