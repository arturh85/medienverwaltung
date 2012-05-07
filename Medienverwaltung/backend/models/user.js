(function () {
    "use strict";

    var mongoose = require("mongoose"),
        salt = 'mySaltyString',
        SHA2 = new (require('jshashes').SHA512)();

    function encodePassword( pass ){
        if( typeof pass === 'string' && pass.length < 6 )
            return ''

        return SHA2.b64_hmac(pass, salt )
    }

    var User = new mongoose.Schema({
        claimedIdentifier: String,
        email: {type: String, required: true, unique: true, trim: true, lowercase: true },
        password: {type: String, set: encodePassword, required: false },

        fbId: String,
        fullname: String,
        fbLink: String,
        gender: String
    });

    User.statics.classicLogin = function(login, pass, cb) {
        mongoose.models.User
            .where( 'email', login )
            .where( 'password', encodePassword(pass) )
            .findOne( cb );
    }

    mongoose.model('user', User);
}());
