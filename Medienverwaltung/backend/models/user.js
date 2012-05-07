(function () {
    "use strict";


    var cfg = module.parent.exports.cfg;

    var mongoose = require("mongoose"),
        salt = cfg.security.salt,
        SHA2 = new (require('jshashes').SHA512)();


    require("../types/email.js").loadType(mongoose);

    function encodePassword(pass) {
        if (typeof pass === 'string' && pass.length < 6)
            return ''

        return SHA2.b64_hmac(pass, salt)
    }

    // from ../types/email.js
    var Email = mongoose.SchemaTypes.Email;

    var User = new mongoose.Schema({
        // user attributes
        fullname:String,
        gender:String,
        email:{type:Email, required:true, unique:true, trim:true, lowercase:true },
        validatedEmail:String,


        // for password login
        password:{type:String, set:encodePassword, required:false },

        // for openid login
        claimedIdentifier:String,

        // for facebook login
        fbId:String,
        fbLink:String,

        // originally received metadata
        openIdMetaData:{},
        facebookMetaData:{}

    });

    User.statics.classicLogin = function (login, pass, cb) {
        mongoose.models.User
            .where('email', login)
            .where('password', encodePassword(pass))
            .findOne(cb);
    }

    mongoose.model('user', User);
}());
