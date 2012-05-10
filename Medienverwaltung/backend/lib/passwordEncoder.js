"use strict";

var cfg = module.parent.exports.cfg;

var salt = cfg.security.passwordSalt,
SHA2 = new (require('jshashes').SHA512)();

module.exports.encodePassword = function(pass) {
    return SHA2.b64_hmac(pass, salt);
};
