const { User, Driver } = require('../../../data/models/index')
const validator = require('../../../modules/validators/api/index')
const UserService = require('../services/UserService')
const responseHelper = require('../../api/resources/response');
const messages = require('../../../../config/constant.json');
const { sequelize, UserDeviceToken } = require('../../../data/models');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const path = require('path');
const Validator = require('../../../modules/middleware/validation');
require('../../../../config/passport')(passport);

class UserController {
	async signup(req, res) {
		try {
			await Validator.signup_Validation(req.body)
			var user = await UserService.signup(req.body.firstName, req.body.lastName, req.body.mobilenumber, req.body.email, req.body.password, req.body.type)
			return responseHelper.success(user, 'sign up successfully', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async login(req, res) {
		try {
			await Validator.login_Validation(req.body);
			var user = await UserService.login(req.body.email, req.body.password)
			if (user) {
				console.log("data=========>",user.email)
				var token = jwt.sign({ user }, 'secretkey', { expiresIn: '20d' })
				console.log("token==================", token);
				var update = await User.update({ auth_token: token, status:'1'}, { where: { email:user.email } });
				console.log("update==========>", update)
				user.auth_token = token
			}
			return responseHelper.success(user, 'login successfully', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async ride_now(req, res) {
		try {
			await Validator.ride_now_Validation(req.body)
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user = decodedData.user.user_id;
			var data = await UserService.ride_now(req,user)
			return responseHelper.success(data, 'start ride', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async go_online(req, res) {
		try {
			await Validator.go_online_Validation(req.body)
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user = decodedData.user.user_id;
			var data = await UserService.go_online(req,user)
			return responseHelper.success(data, 'online driver', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async get_nearest_trip(req, res) {
		try {
			await Validator.nearest_trip_Validation(req.body)
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user = decodedData.user.user_id;
			var data = await UserService.get_nearest_trip(req,user)
			return responseHelper.success(data, 'nearest trip', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async accepted_Trip(req, res) {
		try {
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user_id = decodedData.user.user_id;
			var data = await UserService.accepted_Trip(req,user_id)
			return responseHelper.success(data, 'Trip accepted successfully', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async rejected_Trip(req, res) {
		try {
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user_id = decodedData.user.user_id;
			var data = await UserService.rejected_Trip(req,user_id)
			return responseHelper.success(data, 'rejected trip', res)
		} catch (error) {
			console.log("error=========>", error)
			return responseHelper.error(error, res)
		}
	}
	async start_ride(req, res) {
		try {
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user_id = decodedData.user.user_id;
			var data = await UserService.start_ride(req,user_id)
			return responseHelper.success(data, 'ride started', res)
		} catch (error) {
			console.log("error============>", error)
			return responseHelper.error(error, res)
		}
	}
	async completed_trip(req, res) {
		try {
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token, 'secretkey');
			var user_id = decodedData.user.user_id;
			var data = await UserService.completed_trip(req,user_id)
			return responseHelper.success(data, 'trip completed successfully', res)
		} catch (error) {
			return responseHelper.error(error, res)
		}
	}

	async create_availibility_time(req,res){
		try{
			await Validator.create_driver_timeValidation(req.body)
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token,'secretkey')
			var user= decodedData.user.user_id;
			var data = await UserService.create_availibility_time(req.body,user)
			return responseHelper.success(data,'driver created time successfully',res)
		}catch(error){
			console.log("error===========>",error)
			return responseHelper.error(error,res)
		}
	}
	async update_availibility_time(req,res){
		try{
			await Validator.update_driver_timeValidation(req.body)
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token,'secretkey')
			var user= decodedData.user.user_id;
			var data = await UserService.update_availibility_time(req.body,user)
			return responseHelper.success(data,'driver updated time successfully',res)
		}catch(error){
			console.log("error===========>",error)
			return responseHelper.error(error,res)
		}
	}
	async dlt_availibility_time(req,res){
		try{
			await Validator.dlt_driver_time_Validation(req.body)
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token,'secretkey')
			var user= decodedData.user.user_id;
			var data = await UserService.dlt_availibility_time(req.body,user)
			return responseHelper.success(data,'driver is no available for this day',res)
		}catch(error){
			console.log("error===========>",error)
			return responseHelper.error(error,res)
		}
	}
	async driver_weekly_list(req,res){
		try{
			
			var token = req.headers.authorization;
			var decodedData = jwt.verify(token,'secretkey')
			var user= decodedData.user.user_id;
			var data = await UserService.driver_weekly_list(req.body,user)
			console.log("data==========>",data)
			return responseHelper.success(data,'driver_weekly_list',res)
		}catch(error){
			console.log("error===========>",error)
			return responseHelper.error(error,res)
		}
	}
}
module.exports = new UserController();