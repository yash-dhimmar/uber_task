const StripeService = require('../../api/services/StripeService')
const responseHelper = require('../../api/resources/response');
const jwt = require('jsonwebtoken')
const Validator = require('../../../modules/middleware/validation');

class StripeController {
  async createcustomer(req, res) {
    try {
      var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var user_id = decodedData.user.user_id;
      var data = await StripeService.createcustomer(req.body, user_id)
      return responseHelper.success(data, 'customer created successfully', res)
    } catch (error) {
      console.log("error===========>", error)
      return responseHelper.error(error, res)
    }
  }
  async addcard(req, res) {
    try {
      await Validator.addcardValidation(req.body)
      var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var user_id = decodedData.user.user_id;
      var data = await StripeService.addcard(req.body, user_id)
      return responseHelper.success(data, 'customer add card details submited successfully', res)
    } catch (error) {
      console.log("error============>", error)
      return responseHelper.error(error, res)
    }
  }
  async createcharges(req, res) {
    try {
      await Validator.chargesValidation(req.body)
      var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var user_id = decodedData.user.user_id;
      var data = await StripeService.createcharges(req.body,user_id)
      return responseHelper.success(data, 'customer charges', res)
    } catch (error) {
      console.log("error============>", error)
      return responseHelper.error(error, res)
    }
  }
  async retrievecustomer(req, res) {
    try {
      await Validator.retrievecustomerValidation(req.body)
      var data = await StripeService.retrievecustomer(req)
      return responseHelper.success(data, 'customer ', res)
    } catch (error) {
      console.log("error============>", error)
      return responseHelper.error(error, res)
    }
  }
  async customerlist(req, res) {
    try {
      var data = await StripeService.customerlist(req)
      return responseHelper.success(data, 'customer - list ', res)
    } catch (error) {
      console.log("error============>", error)
      return responseHelper.error(error, res)
    }
  }
}
module.exports = new StripeController()