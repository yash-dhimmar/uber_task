const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();
const validate = require('../validators/admin/index');
const crypto = require("crypto");
const passport = require("passport");
const {User,UserDeviceToken} = require('../../data/models/index');
const responseHelper = require('../../v1/api/resources/response');

class GlobalAuthClass {
    async authenticate(req, res, next) {
      try {
        if ('authorization' in req.headers && req.headers.authorization != null) {
          var token = req.headers.authorization;
          console.log("token============>", token)
          var decodedData = jwt.verify(token, 'secretkey');
          if (decodedData.iat < decodedData.exp) {
            next()
          }
        } else {
          throw new Error('Authorization token is missing');
        }
      } catch (error) {
        console.log(error)
        return responseHelper.error(error, res)
      }
    }
  
  }
  
  module.exports = new GlobalAuthClass();