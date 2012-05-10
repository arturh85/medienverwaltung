(function () {
    "use strict";

    var cfg = module.exports.cfg = module.parent.exports.cfg;

    var mongoose = require("mongoose");
    require("../lib/email.js").loadType(mongoose);

    var encodePassword = require("../lib/passwordEncoder.js").encodePassword;

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

    mongoose.model('user', User);
}());
