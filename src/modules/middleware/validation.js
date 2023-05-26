const promise = require('bluebird');
const Joi = require('joi');

class Validator {
  async signupValidation(body) {
    try {
      const JoiSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobilenumber: Joi.string().length(10).required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        type: Joi.string().required(),
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }

  async loginValidation(body) {
    try {
      const JoiSchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
}

  module.exports = new Validator() 