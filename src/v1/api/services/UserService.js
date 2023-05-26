const { User, Driver, sequelize, pickuplocation, droplocation, Trip } = require('../../../data/models/index')
const promise = require('bluebird')
const ejs = require('ejs')
const path = require('path')
const helper = require('../../../utills/helper')
const jwt = require('jsonwebtoken')
const uuid = require('uuid');
const validator = require('../../../modules/validators/api/index')
const passwordHelper = require('../../../utills/passwordHelper')
const bcrypt = require('bcrypt');

class UserService {
  async signup(firstName, lastName, mobilenumber, email, password, type) {
    try {
      return new Promise(async (resolve, reject) => {
        const hash = await bcrypt.hash(password, 10)
        var data = await User.findAll({
          where: {
            email: email
          }
        })
        if (!data.length > 0) {
          var data = await User.create({
            firstName: firstName,
            lastName: lastName,
            mobilenumber: mobilenumber,
            email: email,
            password: hash,
            type: type
          })
          console.log("data====>", data)
          if (data) {
            resolve(data)
          }
        } else {
          var err = { message: "email is already exit" }
          reject(err)
        }
      })
    } catch (error) {
      return reject(error)
    }
  }
  async login(body, user_id) {
    try {
      return new Promise(async (resolve, reject) => {
        let { email, password } = body

        var data = await User.findAll({
          where: {
            email: email,
            user_id: user_id
          }
        });
        if (data.length > 0) {
          var pass = bcrypt.compareSync(`${password}`, data[0].password)
          if (pass) {
            return resolve(pass[0])
          } else {
            var err = { message: "enter a valid password" }
            reject(err)
          }
        } else {
          var err = { message: "enter a valid email" }
          reject(err)
        }
      })
    } catch (error) {
      return reject(error)
    }
  }

  async ridenow(req,user_id) {
    try {
      return new Promise(async (resolve, reject) => {
        let { firstName, email } = req.body
        let { user_id } = req.body.pickuplocation

        var data = await User.findAll({
          where: {
            firstName: firstName,
            email: email,
            user_id:user_id
          }
        })
        var pickup = await pickuplocation.create(req.body.pickuplocation);
        console.log("data=========>", pickup)
        await droplocation.create(req.body.droplocation);
        var pickupSchema = await pickuplocation.findOne({ where: { user_id: user_id } });
        var dropSchema = await droplocation.findOne({ where: { user_id: user_id } });

        const generateTripFare = () => {
          return Math.random() * (1000 - 100) + 100;
        };
        let newTrip = {};
        newTrip = req.body;
        newTrip['tripDate'] = new Date();
        newTrip['user_id'] = `${user_id}`;
        newTrip['pickuplocation_id'] = pickupSchema.getDataValue('pickuplocation_id');
        newTrip['droplocation_id'] = dropSchema.getDataValue('droplocation_id');
        newTrip['tripfare'] = generateTripFare();
        newTrip['farecollected'] = false;
        const createdTrip = await Trip.create(newTrip);
        return resolve(createdTrip)
      })
    } catch (error) {
      return reject(error)
    }
  }

  async goonline(req, res) {
    try {
      return new Promise(async (resolve, reject) => {
        var nearestTrip = await this.getnearesttrip(req)
        if (nearestTrip == null) return res.status(400).send({ message: 'No trips available right now.' });
        console.log("nearestTrip================>", nearestTrip);

        // Check if the driver exists or not
        const { user_id } = req.body.driver;
        const driverSchema = await User.findOne({
          attributes: ['firstName', 'lastName', 'email', 'mobilenumber'],
          where: { user_id: user_id }
        });
        if (!driverSchema) return res.status(400).send({ message: 'Driver doesnt exist.' });
        nearestTrip['driver'] = JSON.parse(JSON.stringify(driverSchema, null, 4));

        //Update the driver in the Trip details
        var data = Trip.update({ driver_id: user_id }, { where: { user_id: nearestTrip.user_id } }).then(() => {
          console.log("Driver Details Updated=========>", data);
        });
        var data = {
          user: nearestTrip,
          driver: driverSchema
        }
        return resolve(data)
      })
    } catch (error) {
      return reject(eerror)
    }
  }

  async getnearesttrip(req) {
    try {
      return new Promise(async (resolve, reject) => {
        let { trip_id } = req.body.user
        var data = await Trip.findOne({ where: { trip_id: trip_id } })
        console.log("newTrip=============>", data)
        return resolve(data);
      });
    } catch (error) {
      return reject(error)
    }
  }

  async acceptedTrip(req) {
    try {
      return new Promise(async (resolve, reject) => {
        const { driver_id } = req.body.driver;

        const tripDetails = await Trip.findOne({ where: { driver_id: driver_id } });
        if (!tripDetails) {
          var err = {message:"no trips is vailable "}
          reject(err)
        }
        console.log(tripDetails);
        const calculatePickupDistance = () => {
          return Math.random() * (200 - 5) + 5;
        };
        const calculatePickupTime = () => {
          return Math.random() * (240 - 10) + 10;
        };
        tripDetails.setDataValue('tripStatus', 'Driver Accepted');
        tripDetails.setDataValue('pickupdistance', calculatePickupDistance());
        tripDetails.setDataValue('estimatepickuptime', calculatePickupTime());
        await tripDetails.save();
        resolve(tripDetails[0])
      })
    } catch (error) {
      return reject(error)
    }
  }

  async rejectedTrip(req) {
    try {
      return new Promise(async (resolve, reject) => {
        const { driver_id } = req.body
        const trip = await Trip.findOne({ where: { driver_id: driver_id } })
        if (!trip) {
          var err = { message: "No trips assigned to this driver" }
          reject(err)
        }
        trip.setDataValue('tripStatus', 'Driver Rejected')
        await trip.save();
        return resolve(trip)
      })
    } catch (error) {
      return reject(error)
    }
  }































  // async signupWithEmail(req) {
  //     const t = await sequelize.transaction();
  //     try {
  //         const body = req.body
  //         var existUser = await this.findUserByEmail(body)
  //         const subject = 'Email Verification'
  //         if (existUser) {
  //             const url = process.env.APP_URL + `api/v1/user/verify-email/` + existUser.user_id;
  //             const imgUrl = process.env.APP_URL + `images/logo.png`
  //             const file = path.join(__dirname, '../../../views/html/backend/verification_email.ejs');
  //             const htmlData = await ejs.renderFile(file, {
  //                 url: url,
  //                 user: existUser,
  //                 imgUrl: imgUrl
  //             })
  //             if (existUser.status == 0 && existUser.email_verified_at == null) {
  //                 await helper.sendMail(existUser, subject, htmlData)
  //                 const error = new Error('EMAIL_NOT_VERIFIED')
  //                 error.code = 400
  //                 throw error
  //             } else if (existUser.status == 0) {
  //                 const error = new Error('USER_BANNED')
  //                 error.code = 403
  //                 throw error
  //             }
  //             const error = new Error('EMAIL_EXISTS')
  //             error.code = 402
  //             throw error
  //         }
  //         body.register_type = 1
  //         const user = await User.create(body, {
  //             transaction: t
  //         });
  //         const url = process.env.APP_URL + `api/v1/user/verify-email/` + user.user_id;
  //         const imgUrl = process.env.APP_URL + `images/logo.png`;
  //         const file = path.join(__dirname, '../../../views/html/backend/verification_email.ejs');
  //         const htmlData = await ejs.renderFile(file, {
  //             url: url,
  //             user: user,
  //             imgUrl: imgUrl
  //         });
  //         const sendMail = await helper.sendMail(user, subject, htmlData);
  //         await t.commit();
  //     } catch (error) {
  //         if (t) await t.rollback();
  //         return promise.reject(error)
  //     }
  // }
  // async findUserByEmail(body) {
  //     try {
  //         let user = await User.findOne({
  //             email: body.email.trim().toLowerCase(),
  //             register_type: 1
  //         })
  //         return user
  //     } catch (error) {
  //         return promise.reject(error)
  //     }
  // }

  // /* verify email address api */
  // async verifyMail(req) {
  //     const t = await sequelize.transaction();
  //     try {
  //         const user = await User.findOne({
  //             where: {
  //                 user_id: req.params.uuid
  //             }
  //         }, {
  //             transaction: t
  //         });
  //         if (!user) {
  //             var error = new Error('USER_NOT_FOUND')
  //             error.code = 400
  //             throw error
  //         } else if (user.email_verified_at != null || user.status == 1) {
  //             var error = new Error('VERIFIED')
  //             error.code = 400
  //             throw error
  //         } else {
  //             // update user
  //             await user.update({
  //                 email_verified_at: new Date(),
  //                 status: 1
  //             }, {
  //                 transaction: t
  //             })
  //         }
  //         await t.commit();
  //     } catch (error) {
  //         await t.rollback();
  //         return promise.reject(error)
  //     }
  // }

  // async otherSigninMethod(req) {
  //     const t = await sequelize.transaction();
  //     try {
  //         var find;
  //         // google
  //         if (req.body.register_type == 2) {
  //             var google_id = req.body.google_id
  //             find = {
  //                 google_id: google_id
  //             }
  //         }
  //         // facebook
  //         if (req.body.register_type == 3) {
  //             var facebook_id = req.body.facebook_id
  //             find = {
  //                 facebook_id: facebook_id
  //             }
  //         }
  //         // apple
  //         if (req.body.register_type == 4) {
  //             var apple_id = req.body.apple_id
  //             find = {
  //                 apple_id: apple_id
  //             }
  //         }
  //         req.body.email_verified_at = new Date();
  //         req.body.status = 1;
  //         if (req.body.register_type != 1) {
  //             const [user, created] = await User.findOrCreate({
  //                 where: find,
  //                 attributes: ['user_id', 'name', 'email', 'google_id', 'password', 'register_type', 'email_verified_at', 'facebook_id', 'status', 'createdAt', 'updatedAt'],
  //                 defaults: req.body,
  //                 include: [{
  //                     as: 'Token',
  //                     model: UserDeviceToken,
  //                     attributes: {
  //                         exclude: ['device_token']
  //                     },
  //                     required: false
  //                 }],
  //                 order: [['Token', 'updatedAt', 'DESC']],
  //                 transaction: t
  //             });
  //             user.new_record = created;
  //             if (created == false) {
  //                 if (user.status == 0) {
  //                     const error = new Error('USER_BANNED');
  //                     error.code = 403;
  //                     throw error;
  //                 }
  //             }
  //             if (user.UserNotifications != undefined && user.UserNotifications.length > 0) {
  //                 await UserNotification.destroy({
  //                     where: {
  //                         type: 3,
  //                         fk_user_id: user.user_id
  //                     }
  //                 }, {
  //                     transaction: t
  //                 })
  //             }
  //             await user.update({
  //                 last_active_at: new Date()
  //             }, {
  //                 transaction: t
  //             });
  //             var token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.AUTHORIZATION_SECRET_KEY, {
  //                 expiresIn: expiresIn
  //             });
  //             await user.createToken({
  //                 fk_user_id: user.user_id,
  //                 device_id: req.headers.device_id || '',
  //                 device_token: token,
  //                 device_type: req.headers.device_type || '',
  //             }, {
  //                 transaction: t
  //             })
  //             await t.commit();
  //             user.token = token;
  //             return user;
  //         }
  //     } catch (error) {

  //         if (t) await t.rollback();
  //         return promise.reject(error);
  //     }
  // }
  // async validateEmailLogin(req) {
  //     try {
  //         var email = req.body.email.trim().toLowerCase();
  //         var user = await User.findOne({
  //             attributes: ['user_id', 'name', 'email', 'google_id', 'password', 'register_type', 'email_verified_at', 'facebook_id', 'status', 'createdAt', 'updatedAt'],
  //             where: {
  //                 email: email,
  //                 register_type: 1
  //             },
  //             include: [
  //                 { as: 'Token', model: UserDeviceToken, attributes: { exclude: ['device_token'] } },
  //             ]
  //         });
  //         if (!user) {
  //             const error = new Error('EMAIL_NOT_EXIST');
  //             error.code = 400;
  //             throw error;
  //         } else if (user.email_verified_at == null) {
  //             const subject = 'Email Verification';
  //             const url = process.env.APP_URL + `verify-email/` + user.user_id;
  //             const imgUrl = process.env.APP_URL + `images/logo.png`;
  //             const file = path.join(__dirname, '../../views/html/backend/verification_email.ejs');
  //             const htmlData = await ejs.renderFile(file, { url: url, user: user, imgUrl: imgUrl });
  //             await helper.sendMail(user, subject, htmlData);
  //             const error = new Error('EMAIL_NOT_VERIFIED');
  //             error.code = 400;
  //             throw error;
  //         } else if (user.status == 0) {
  //             const error = new Error('USER_BANNED');
  //             error.code = 403;
  //             throw error;
  //         }
  //         await user.update({ last_active_at: new Date() });
  //         return user;
  //     } catch (error) {
  //         console.log(error);
  //         return promise.reject(error);
  //     }
  // }
  // async getUserDetail(req) {
  //     try {
  //         var user = await User.findOne({
  //             attributes: ['user_id', 'name', 'email', 'google_id', 'register_type', 'email_verified_at', 'facebook_id', 'status', 'createdAt', 'updatedAt'],
  //             where: {
  //                 user_id: req.authId
  //             }
  //         });
  //         return user;
  //     } catch (error) {
  //         console.log(error);
  //         return promise.reject(error);
  //     }
  // }

  // async refreshToken(req) {
  //     const transaction = await sequelize.transaction();
  //     try {
  //         if (!req.headers.authorization) throw {message:'TOKEN_REQUIRED',code:400};
  //         const parted = req.headers.authorization.split(' ');
  //         var token;
  //         if (parted[0] === 'Bearer')
  //             token = parted[1];
  //         else {
  //             const error = new Error('INVALID_TOKEN');
  //             error.code = 403;
  //             throw error;
  //         }
  //         const userDeviceToken = await UserDeviceToken.findOne({
  //             where: { device_token: token },
  //             include: [{
  //                 as: 'User',
  //                 model: User
  //             }]
  //         })
  //         if (!userDeviceToken) {
  //             const error = new Error('TOKEN_NOT_PRESENT');
  //             error.code = 403;
  //             throw error;
  //         }
  //         if (!userDeviceToken.User) {
  //             const error = new Error('USER_DELETED');
  //             error.code = 405;
  //             throw error;
  //         };
  //         const user = userDeviceToken.User;
  //         const userData = user;
  //         if (!userDeviceToken) {
  //             const error = new Error('INVALID_TOKEN');
  //             error.code = 403;
  //             throw error;
  //         }
  //         const newToken = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.APP_KEY, {
  //             expiresIn: process.env.EXPIRESIN
  //         });
  //         await UserDeviceToken.create({
  //             fk_user_id: user.user_id,
  //             device_id: req.headers.device_id || '',
  //             device_token: newToken,
  //             device_type: req.headers.device_type || '',
  //         }, {
  //             transaction
  //         })
  //         await UserDeviceToken.destroy({
  //             where: {
  //                 device_token: token
  //             }
  //         }, {
  //             transaction
  //         });
  //         await transaction.commit();
  //         user.dataValues.token = newToken;
  //         return user;
  //     } catch (error) {
  //         await transaction.rollback();
  //         console.log(error);
  //         return promise.reject(error);
  //     }
  // }

  // /* forgot password api */
  // async forgotPassword(req) {
  //     const t = await sequelize.transaction();
  //     try {
  //         req.body.email = req.body.email.trim().toLowerCase();
  //         const user = await this.findUserByEmail(req.body);
  //         if (!user){
  //             const error = new Error('INVALID_EMAIL');
  //             error.code = 400;
  //             throw error;
  //         }
  //         if (user.status == 0) {
  //             const error = new Error('USER_BANNED');
  //             error.code = 400;
  //             throw error;
  //         }
  //         req.body.token = uuid.v4();
  //         req.body.createdAt = new Date;
  //         await UserResetPassword.create(req.body, {
  //             transaction: t
  //         });
  //         const subject = 'Reset Password';
  //         const url = process.env.APP_URL + `reset-password/` + req.body.token;
  //         const imgUrl = process.env.APP_URL + `images/logo.png`;
  //         const file = path.join(__dirname, '../../../views/html/backend/forgot_password.ejs');
  //         const htmlData = await ejs.renderFile(file, {url:  url, user:user, imgUrl:imgUrl});
  //         await helper.sendMail(user, subject, htmlData);
  //         await t.commit();
  //         return;
  //     } catch (error) {
  //         console.log(error);
  //         if (t) await t.rollback();
  //         return promise.reject(error);
  //     }
  // }

  // /* reset password form */
  // async resetPasswordForm(req) {
  //     const t = await sequelize.transaction();
  //     try {
  //         var user = await UserResetPassword.findOne({
  //             where: {
  //                 token: req.params.uuid
  //             }
  //         }, {
  //             transaction: t
  //         });
  //         var userId = null;
  //         if (user == null) {
  //             throw {message:messages['en']['LINK_EXPIRED'],code:403};
  //         }
  //         req.body.email = user.email;
  //         await validator.validateForgotPasswordAPI(req.body);
  //         const userData = await User.findOne({
  //             where: {
  //                 email: user.email,
  //                 register_type:1
  //             }
  //         }, {
  //             transaction: t
  //         });
  //         if (userData == null) {
  //             throw {message:messages['en']['USER_NOT_FOUND'],code:404};
  //         }
  //         if (userData.status == 0) {
  //             throw {message:messages['en']['USER_BANNED'],code:403};
  //         }
  //         userId = userData.user_id || null;
  //         await t.commit();
  //         req.session.status = true;
  //         req.session.user = user || null;
  //         req.session.uuid = userId || null;
  //         req.session.message = null;
  //         return req.session;
  //     } catch (error) {
  //         console.log(error);
  //         if (t) await t.rollback();
  //         return promise.reject(error)
  //     }
  // }
  // /* update password */
  // async resetPassword(req, res) {
  //     try {
  //         var user_id = req.body.uuid;
  //         var user = await UserResetPassword.findOne({
  //             where: { token: req.params.uuid }
  //         });
  //         var token = req.body.token;
  //         var email = req.body.email.trim().toLowerCase();
  //         if (user) {
  //             if (user.status == 0) {
  //                 throw {message:messages['en']['USER_BANNED'],code:403};
  //             }
  //             const userData = await User.findOne({
  //                 where: {
  //                     email: email,
  //                     user_id: user_id,
  //                     register_type:1
  //                 }
  //             });
  //             if (userData != null) {
  //                 userData.password = req.body.password;
  //                 userData.save();
  //                 UserResetPassword.destroy({ where: { email: email }})
  //                 req.session.status = true;
  //                 req.session.message = 'Password Updated.';
  //                 return req.session;
  //             } else {
  //                 throw {message:messages['en']['USER_BANNED'],code:403}
  //             }
  //         } else {
  //             throw {message:messages['en']['LINK_EXPIRED'],code:403};
  //         }
  //     } catch (error) {
  //         console.log(error);
  //         if (t) await t.rollback();
  //         return promise.reject(error)
  //     }
  // }



  // async changeUserPassword (body,user_id) {
  //     const t = await sequelize.transaction();
  //     try{
  //         const user = await User.findByPk(user_id,{transaction:t})
  //         if(user.register_type != 1){
  //             const error = new Error("DENIED_CHANGE_PASSWORD");
  //             error.code = 400;
  //             throw error;
  //         }
  //         await passwordHelper.checkPassword(body.password,user.password,3);
  //         let data = await bcrypt.hash(body.new_password, 10)
  //         let passwordValidations = await passwordHelper.checkPassword(body.confirm_password,data,1);
  //         if(passwordValidations){
  //             await user.update({password: body.new_password},{transaction:t})
  //             await t.commit();
  //             return user;
  //         }
  //     } catch(error){
  //         if(t) await t.rollback();
  //         return promise.reject(error)
  //     }
  // }
}
module.exports = new UserService()





// async checkout(user_id, body) {
//   return new Promise(async (resolve, reject) => {
//     try {

//       var [check] = await db.query(`select * from add_cart where user_id='${user_id}'`)
//       let { address_id, coupan_id } = body

//       var [address] = await db.query(`select address_id from address where user_id='${user_id}' and address_id='${address_id}'`)

//       var cod = "COD"
//       var data = await this.cart(user_id, body)
//       var date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

//       if (check.length > 0) {

//         var [insert] = await db.query(`insert into orders(date,user_id,sub_total,deliverycharge,grandtotal,payment_type,address_id,status,coupan_id) values ('${date}','${user_id}','${data.total}','${data.deliverycharge}','${data.grandtotal}','${cod}','${address[0].address_id}','${1}','${coupan_id}')`)

//         if (insert) {
//           var [select] = await db.query(`select * from product inner join add_cart on product.product_id=add_cart.product_id  join orders on add_cart.user_id=orders.user_id where orders.user_id='${user_id}' and add_cart.user_id='${user_id}'`)

//           for (let i = 0; i < select.length; i++) {
//             var orderitem = await db.query(`insert into order_item(product_id,order_id,price,discount_price,quantity)values('${select[i].product_id}','${select[i].order_id}','${select[i].price}','${select[i].discount_price}','${select[i].quantity}')`)
//           }
//         }

//       }
//       var cartlist = {
//         item_total: data,
//         delieverytype: cod
//       }
//       resolve(cartlist)
//     } catch (error) {
//       return reject(error)
//     }
//   })
// }
// async order_list(user_id) {
//   try {
//     return new promise(async (resolve, reject) => {
//       var [data] = await db.query(`select orders.date ,orders.order_id,orders.status,orders.grandtotal as Totalpayment,address.type as Deliveredto from orders inner join address on address.address_id=orders.address_id where orders.user_id='${user_id}'`)
//       resolve(data)

//       return resolve(data);
//     })
//   } catch (error) {
//     return reject(error);
//   }
// }

// async order_details(user_id, body) {
//   try {
//     return new promise(async (resolve, reject) => {

//       let { order_id } = body

//       var [join] = await db.query(`select o.order_id ,o.payment_type as paymenttype ,o.date ,a.home_detail,a.landmark from orders as o inner join address as a on o.address_id=a.address_id 
//       where o.user_id='${user_id}' and o.order_id='${order_id}'`);

//       if (join.length > 0) {

//         var [product] = await db.query(`select p.image,p.productname,p.price,o.quantity from order_item as o inner join product as p on o.product_id=p.product_id where o.order_id='${order_id}'`);

//         join[0].item = product

//         var [totaldata] = await db.query(`select sub_total,deliverycharge,grandtotal from orders where order_id='${order_id}'`)

//         join[0].Billdetails = totaldata[0]
//         resolve(join);
//       } else {
//         var data = {
//           message: "order is not available"
//         }
//         reject(data);
//       }

//     })

//   } catch (error) {
//     return reject(error);
//   }
// }



