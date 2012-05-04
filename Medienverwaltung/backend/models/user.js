
(function () {
    "use strict";

    var mongoose = require("mongoose");
    var mongooseAuth = require("mongoose-auth");

    var db = module.parent.exports.db;

    var User, UserSchema = new mongoose.Schema({});

    function addUser(user) {
        var Model = db.model('user');
        var promise = mongoose.Promise();
        var doc = new Model(user);
        doc.save(function (err) {
            if(err) {
                throw err;
            }

            promise.fulfill();
        });

        return promise;
    }

    function findUserByEmail(email) {
        var Model = db.model('user');
        var qw = Model.findOne({email: email}, function(err, doc) {
            console.log("findUserByEmail(" + email + ") = " + doc);
        });

        return qw;
    }

    UserSchema.plugin(mongooseAuth, {
        everymodule: {
            everyauth: {
                User: function () {
                    return User;
                }
            }
        }
        , password: {
            loginWith: 'email'
            , extraParams: {
                phone: String
                , name: {
                    first: String
                    , last: String
                }
            }
            , everyauth: {
                respondToLoginSucceed: function (res, user) {
                    console.log("respondToLoginSucceed")
                    if (user) { // Then the login was successful
                        console.log("sending login success!");
                        res.json({ success: true }, 200);
                    }
                }
                , respondToLoginFail: function (req, res, errors, login) {
                    console.log("respondToLoginFail")
                    if (!errors || !errors.length) return;
                    return res.json({ success: false, errors: errors });
                }

                , authenticate: function (login, password) {
                    var errors = [];

                    if (!login) {
                        errors.push('Missing login');
                    }
                    if (!password) {
                        errors.push('Missing password');
                    }
                    if (errors.length) {
                        return errors;
                    }

                    var UserCollection = db.model("user");

                    var user = findUserByEmail(login);
                    if (!user) {
                        return ['Login failed'];
                    }
                    if (user.password !== password) {
                        return ['Login failed'];
                    }
                    return user;
                }

                , validateRegistration: function (newUserAttrs, errors) {
                    var login = newUserAttrs.login;
                    if (findUserByEmail(login)) {
                        errors.push('Login already taken');
                    }
                    return errors;
                }
                , registerUser: function (newUserAttrs) {
                    var login = newUserAttrs[this.loginKey()];
                    var user = addUser(newUserAttrs);
                    findUserByEmail(login) = user;
                    return user;
                }
                , getLoginPath: '/login'
                , postLoginPath: '/login'
                //, loginView: 'login.jade'
                , getRegisterPath: '/register'
                , postRegisterPath: '/register'
                , registerView: 'register.jade'
                , loginSuccessRedirect: '/'
                , registerSuccessRedirect: '/'
            }
        }
    });

    mongoose.model('user', UserSchema);
}());
