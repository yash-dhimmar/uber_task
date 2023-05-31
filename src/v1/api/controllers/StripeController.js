const StripeService = require('../../api/services/StripeService')
const responseHelper = require('../../api/resources/response');

class StripeController {

  async createcustomer(req,res){
    try{
      var data = await StripeService.createcustomer(req)
      return responseHelper.success(data,'customer created successfully',res)
    }catch(error){
      return responseHelper.error(error,res)
    }
  }

  async addcard(req,res){
    try{
      var data = await StripeService.addcard(req.body)
      return responseHelper.success(data,'customer add card details submited successfully',res)
    }catch(error){
      console.log("error============>",error)
      return responseHelper.error(error,res)
    }
  }

  async createcharges(req,res){
    try{
      var data = await StripeService.createcharges(req.body)
      return responseHelper.success(data,'customer charges',res)
    }catch(error){
      console.log("error============>",error)
      return responseHelper.error(error,res)
    }
  }

  async retrievecustomer(req,res){
    try{
      var data = await StripeService.retrievecustomer(req)
      return responseHelper.success(data,'customer ',res)
    }catch(error){
      console.log("error============>",error)
      return responseHelper.error(error,res)
    }
  }

  async customerlist(req,res){
    try{
      var data = await StripeService.customerlist(req)
      return responseHelper.success(data,'customer - list ',res)
    }catch(error){
      console.log("error============>",error)
      return responseHelper.error(error,res)
    }
  }







}
module.exports = new StripeController()