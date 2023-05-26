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
			await Validator.signupValidation(req.body)
			var user = await UserService.signup(req.body.firstName, req.body.lastName, req.body.mobilenumber, req.body.email, req.body.password, req.body.type)
			if (user == null) {
				return responseHelper.error(error, res);
			}
			if (user) {
				var token = jwt.sign({ user }, 'secretkey', { expiresIn: '20d' })
				console.log("token==================", token);
				var update = await User.update({ auth_token: token, status: '1' }, { where: { email: user.email } });
				console.log("update==========>", update)
				user.auth_token = token
			}
			return responseHelper.success(user, 'sign up successfully', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}

	async login(req, res) {
		try {
			await Validator.loginValidation(req.body);
			var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var user = decodedData.user.user_id;
			var data = await UserService.login(req.body,user)
			return responseHelper.success(data, 'login successfully', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}

	async ridenow(req, res) {
		try {
			var token = req.headers.authorization;
      var decodedData = jwt.verify(token, 'secretkey');
      var user = decodedData.user.user_id;
			var data = await UserService.ridenow(req,user)
			return responseHelper.success(data, 'start ride', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async goonline(req, res) {
		try {
			var data = await UserService.goonline(req)
			return responseHelper.success(data, 'online driver', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async getnearesttrip(req, res) {
		try {
			var data = await UserService.getnearesttrip(req)
			return responseHelper.success(data, 'nearest trip', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async acceptedTrip(req, res) {
		try {
			var data = await UserService.acceptedTrip(req)
			return responseHelper.success(data, 'Trip accepted successfully', res)
		} catch (error) {
			console.log("error===========>", error)
			return responseHelper.error(error, res)
		}
	}
	async rejectedTrip(req,res){
		try{
			var data = await UserService.rejectedTrip(req)
			return responseHelper.success(data,'rejected trip',res)
		}catch(error){
			console.log("error=========>",error)
			return responseHelper.error(error,res)
		}
	}

	async startride(req,res){
		try{
			var data = await UserService.startride(req)
			return responseHelper.success(data,'ride started',res)
		}catch(error){
			console.log("error============>",error)
			return responseHelper.error(error,res)
		}
	}

	async completedtrip(req,res){
		try{
			var data = await UserService.completedtrip(req)
			return responseHelper.success|(data,'trip completed successfully',res)
		}catch(error){
			return responseHelper.error(error,res)
		}
	}





















	// async getMessages (headers){
	//     if (!headers.language) {
	//         return messages['en'];
	//     } else {
	//         return messages[headers.language];
	//     }
	// }
	// /* mother || user signup */
	// async signup(req, res) {
	//     try {
	//         const body = req.body;
	//         await validator.validateUserSignUpForm(body);
	//         if (req.body.register_type == 1) {
	//             delete req.body.google_id
	//             delete req.body.facebook_id
	//             delete req.body.apple_id
	//             await UserService.signupWithEmail(req);
	//             return responseHelper.success(res, 'EMAIL_VERIFICATION', {});
	//         } else {
	//             const user = await UserService.otherSigninMethod(req);
	//             return responseHelper.success(res, 'LOGIN_SUCCESS', user);
	//         }
	//     } catch (error) {
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }
	// /* verify email address api */
	// async verifyMail(req, res) {
	//     try {
	//         await UserService.verifyMail(req)
	//         res.render(base_path+'/src/views/html/backend/verify-status', {
	//             status: true
	//         });
	//     } catch (error) {
	//         res.render(base_path+'/src/views/html/backend/verify-status', {
	//             message: error.message,
	//             status: false
	//         });
	//     }
	// }
	// /* user login api */
	// async signin(req, res) {
	//     let t;
	//     try {
	//         await validator.validateSignIn(req.body);
	//         // email
	//         if (req.body.register_type == 1) {
	//             const user = await UserService.validateEmailLogin(req);
	//             delete req.body.google_id
	//             delete req.body.facebook_id
	//             delete req.body.apple_id
	//             user.comparePassword(req.body.password, async (err, isMatch) => {
	//                 t = await sequelize.transaction();
	//                 try{
	//                     if (isMatch != undefined && !err) {
	//                         var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.APP_KEY, {
	//                             expiresIn: process.env.EXPIRESIN
	//                         });
	//                         user.dataValues.token = 'Bearer '+token;
	//                         await user.createToken({
	//                             fk_user_id: user.user_id,
	//                             device_id: req.headers.device_id || '',
	//                             device_token: token,
	//                             device_type: req.headers.device_type || '',
	//                         }, {
	//                             transaction: t
	//                         })
	//                         delete user.dataValues.Token
	//                         await t.commit();
	//                         return responseHelper.success(res, 'LOGIN_SUCCESS', user);
	//                     }else{
	//                         throw {message:'INVALID_PASSWORD',code:400};
	//                     }
	//                 } catch(error){
	//                     await t.rollback();
	//                     return responseHelper.error(res, error.message, error.code||501);
	//                 }
	//             })
	//         }
	//         if (req.body.register_type != 1) {
	//             const user = await UserService.otherSigninMethod(req);
	//             return responseHelper.success(res, 'LOGIN_SUCCESS', user);
	//         }
	//     } catch (error) {
	//         console.log(error);
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }
	// /* user logout api */
	// async logout(req, res) {
	//     const transaction = await sequelize.transaction();
	//     try {
	//         await UserDeviceToken.destroy({
	//             where: {
	//                 device_token: req.userToken
	//             }
	//         }, {
	//             transaction
	//         })
	//         await transaction.commit();
	//         return responseHelper.success(res, 'LOGOUT_SUCCESS', {});
	//     } catch (error) {
	//         await transaction.rollback();
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }
	// /* user detail api */
	// async detail(req, res) {
	//     try {
	//         const userData = await UserService.getUserDetail(req);
	//         return responseHelper.success(res, 'USER_DETAIL', userData);
	//     } catch (error) {
	//         console.log(error);
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }

	// /* user refresh token api */
	// async refreshToken(req,res){
	//     try {
	//         var userData = await UserService.refreshToken(req);
	//         return responseHelper.success(res, 'TOKEN_REFRESHED', userData);
	//     } catch (error) {
	//         console.log(error);
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }
	// /* user refresh token api */
	// async forgotPassword(req,res){
	//     try {
	//         await validator.validateForgotPasswordAPI(req.body);
	//         await UserService.forgotPassword(req);
	//         return responseHelper.success(res, 'RESET_LINK_SEND',{});
	//     } catch (error) {
	//         console.log(error);
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }

	// async changePassword(req,res){
	//     try{
	//         await validator.validateUserPassword(req.body)
	//         await UserService.changeUserPassword(req.body,req.authId);
	//         return responseHelper.success(res, 'PASSWORD_CHANGED_SUCCESSFULLY', {});
	//     }
	//     catch(error){
	//         console.log(error);
	//         return responseHelper.error(res, error.message || '', error.code || 500);
	//     }
	// }
	// async resetPasswordForm(req,res) {
	//     var filePath= path.join(__dirname,'../../../views/html/backend/forgot-password');
	//     try {
	//         var session = await UserService.resetPasswordForm(req);
	//         res.render(filePath, {
	//             session: session
	//         });
	//     } catch (error) {
	//         req.session.status = false;
	//         req.session.error = error;
	//         req.session.user = null;
	//         req.session.uuid = null;
	//         res.render(filePath, {
	//             session: req.session
	//         });
	//     }
	// }
	// async resetPassword(req,res){
	//     try {
	//         var session = await UserService.resetPassword(req);
	//         var filePath= path.join(__dirname,'../../../views/html/backend/forgot-password');
	//         res.render(filePath, {
	//             session: session
	//         });
	//     } catch (error) {
	//         req.session.status = false;
	//         req.session.error = error;
	//         req.session.user = null;
	//         req.session.uuid = null;
	//         res.render(filePath, {
	//             session: req.session
	//         });
	//     }
	// }
}
module.exports = new UserController();