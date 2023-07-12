const promise = require('bluebird');
const Joi = require('joi');
class Validator {
  async signup_Validation(body) {
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
  async login_Validation(body) {
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
  async ride_now_Validation(body) {
    try {
      const JoiSchema = Joi.object({
        start_latitude: Joi.string().required(),
        start_longtitude: Joi.string().required(),
        start_point: Joi.string().required(),
        end_latitude: Joi.string().required(),
        end_longtitude: Joi.string().required(),
        end_point: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required(),
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async go_online_Validation(body) {
    try {
      const JoiSchema = Joi.object({
        user: Joi.required(),
        driver: Joi.required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async nearest_trip_Validation(body) {
    try {
      const JoiSchema = Joi.object({
        user: Joi.required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async addcardValidation(body) {
    try {
      const JoiSchema = Joi.object({
        user_stripe_id: Joi.string().required(),
        card_Name: Joi.string().required(),
        card_CVC: Joi.string().required(),
        card_ExpYear: Joi.string().required(),
        card_ExpMonth: Joi.string().required(),
        card_Number: Joi.string().required(),
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async chargesValidation(body) {
    try {
      const JoiSchema = Joi.object({
        user_stripe_id: Joi.string().required(),
        card_id: Joi.string().required(),
        amount: Joi.string().required(),

      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async retrievecustomerValidation(body) {
    try {
      const JoiSchema = Joi.object({
        customer_id: Joi.string().required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async create_driver_timeValidation(body) {
    try {
      const JoiSchema = Joi.object({
        day: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async update_driver_timeValidation(body) {
    try {
      const JoiSchema = Joi.object({
        driver_availibility_id: Joi.string().required(),
        start_time: Joi.string().required(),
        end_time: Joi.string().required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }
  async dlt_driver_time_Validation(body) {
    try {
      const JoiSchema = Joi.object({
        driver_availibility_id: Joi.string().required()
      })
      return await JoiSchema.validateAsync(body);
    } catch (err) {
      let error = { message: err.message, code: 400 };
      return promise.reject(error);
    }
  }


}
module.exports = new Validator() 