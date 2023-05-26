const joiBase = require('joi');
const joiDate = require("@joi/date");
const joi = joiBase.extend(joiDate);
const custMessages = require('../../../../config/constant.json'); 
const promise = require('bluebird');
const lang = 'en';

const options = {
    errors: {
      wrap: {
        label: ''
      }
    }
};

class ApiValidation{
    async validateHeaders (headers){
        try{
            const schema = joi.object({
                language: joi.string().required(),
                authorization: joi.string().required(),
                device_token: joi.string().optional(),
                device_id: headers.app_version ? joi.string().required() : joi.string().optional(),
                device_type: headers.app_version ? joi.number().required() : joi.string().optional(),
                web_app_version : headers.web_app_version ? joi.any().required() : joi.any().optional(),
                app_version: headers.app_version ? joi.any().required() :  joi.any().optional(),
                os: joi.any().required(),
                timezone:headers.app_version ? joi.any().required() :  joi.any().optional(),
            }).unknown();
            return await schema.validateAsync(body,options)
        }catch(error){
            error.code = 400;
            error.message = error.details[0].message;
            return promise.reject(error)
        }
    }
    async validateUserSignUpForm(body){
        try{
            const schema = joi.object({
                register_type:joi.required().valid('1','2','3','4'),
                email:joi.when('register_type',{
                            is: '1',
                            then:
                            joi.string().max(100).regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).trim(true).required()
                            .messages({ 'string.pattern.base': custMessages[lang]['INVALID_EMAIL'] })
                        }),
                password: joi.when('register_type', {is: '1',then:joi.string().min(6).max(18).required()}),
                google_id: joi.when('register_type', {is: '2',then:joi.string().required()}),
                facebook_id: joi.when('register_type', {is: '3',then:joi.string().required()}),
                apple_id: joi.when('register_type', {is: '4',then:joi.string().required()}),
                name:joi.allow('').optional(),
            });
            return await schema.validateAsync(body,options);
        }catch(error){
            console.log('error ====>',error);
            error.code = 400;
            error.message = error.details[0].message;
            return promise.reject(error)
        }
    }
    async validateSignIn(body){
        try{
            const schema = joi.object({
                register_type:joi.valid('1','2','3','4').required(),
                email:joi.when('register_type',{
                        is: '1',
                        then: 
                        joi.string().max(100).regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).trim(true).required()
                        .messages({ 'string.pattern.base': custMessages[lang]['INVALID_EMAIL'] })
                    }),
                password: joi.when('register_type', {is: '1',then:joi.string().min(6).max(18).required()}),
                google_id: joi.when('register_type', {is: '2',then:joi.string().required()}),
                facebook_id: joi.when('register_type', {is: '3',then:joi.string().required()}),
                apple_id: joi.when('register_type', {is: '4',then:joi.string().required()}),
                name:joi.allow('').optional(),
            });
            return await schema.validateAsync(body,options);
        }catch(error){
            console.log('error ====>',error);
            error.code = 400;
            error.message = error.details[0].message;
            return promise.reject(error)
        }
    }
    async validateForgotPasswordAPI(body){
        try {
            const schema = joi.object({
                email: joi.string().max(100).regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).trim(true).required()
                    .messages({
                        'string.pattern.base': custMessages[lang]['INVALID_EMAIL']
                    }),
            });
            return await schema.validateAsync(body, options);
        } catch (error) {
            error.code = 400;
            error.message = error.details[0].message;
            return promise.reject(error)
        }
    }

    async resetPasswordValidation(body){
        try{
            const schema = joi.object({
                token:joi.optional(),
                uuid:joi.optional(),
                email:joi.string().max(100).regex(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/).trim(true).required()
                .messages({ 'string.pattern.base': custMessages[lang]['INVALID_EMAIL'] }),
                password: joi.string().min(6).max(18).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,18}$/).required()
                            .messages({
                                "string.pattern.base": "Password should be 6 characters long, should have 1 upper case and 1 lower case, 1 number and 1 special character"
                            }),
                confirm_password: joi.any().required().valid(joi.ref('password')).messages({'any.only':"password  and comfirm password must be same"}),
            });
            return await schema.validateAsync(body,options)
        }catch(error){
            error.code = 400;
            error.message = error.details[0].message;
            return promise.reject(error)
        }
    }
    async validateUserPassword(body){
        try {
            const schema = joi.object({
                password: joi.string().min(6).max(18).required(),
                new_password: joi.string().min(6).max(18).required(),
                // confirm_password: joi.string().min(6).max(18).required(),
                confirm_password: joi.any().valid(joi.ref('new_password')).required().messages({
                    'any.only': 'confirm password does not match'
                }),
            })
            return await schema.validateAsync(body, options)
        } catch (error) {
            error.message = error.details[0].message;
            error.code = 400;
            return promise.reject(error)
        }
    }
    
}

module.exports = new ApiValidation();