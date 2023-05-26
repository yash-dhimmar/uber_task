const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
// load up the user model
const {User} = require('../src/data/models');

module.exports = function (passport) {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.APP_KEY,
    };
    passport.use('Bearer', new JwtStrategy(opts, async (payload, done) => {
        const user = await User.findByPk(payload.user_id);
        if(!user){
            return done({status:false,error:'USER_DELETED'});
        }
        return done({status:true,user:user});
    }));
};