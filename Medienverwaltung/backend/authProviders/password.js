(function () {
    "use strict";

    var cfg = module.exports.cfg = module.parent.exports.cfg;

    var db = module.parent.exports.db,
        authProviders = module.parent.exports.authProviders,
        encodePassword = require("../lib/passwordEncoder.js").encodePassword;

    authProviders.push(function(everyauth) {
        everyauth.password
            .loginWith('email')
            .getLoginPath('/#/login') // Uri path to the login page
            .postLoginPath('/login') // Uri path that your login form POSTs to
            .getRegisterPath('/#/register') // Uri path to the registration page
            .postRegisterPath('/register') // The Uri path that your registration form POSTs to
            .addToSession( function (sess, user, errors) {
                if(!sess.auth) {
                    sess.auth = {};
                }
                var _auth = sess.auth;

                if (user) {
                    _auth.userId = user.id;
                    _auth.loggedIn = !!user;
                    _auth.loginMethod = 'password';
                }
            })
            .authenticate( function(login, password) {
                var errors = [];

                if (!login) {
                    errors.push('Missing login.');
                }
                if (!password) {
                    errors.push('Missing password.');
                }
                if (errors.length) {
                    console.log("authentication failed: " + JSON.stringify(errors));
                    return errors;
                }

                var promise = this.Promise();
                var encodedPassword = encodePassword(password);
                var Model = db.model('user');

                var qw = Model.findOne({email: login, password: encodedPassword}, function(err, user) {
                    if (err) {
                        errors.push(err.message || err);
                        return promise.fail(errors);
                    }

                    if(!user) {
                        var msg = 'User with login ' + login + ' does not exist.';
                        console.log(msg);
                        errors.push(msg);
                        return promise.fail(errors);
                    }

                    console.log("authenticated: " + JSON.stringify(user));
                    return promise.fulfill(user);
                });

                return promise;
            })
            .respondToLoginFail( function (req, res, errors, login) {
                if (!errors || !errors.length) {
                    return;
                }
                res.redirect("/#/login/error/" + errors.join(" "));
            })
            .validateRegistration( function (newUserAttributes) {
                var errors = [];
                if (!newUserAttributes.email) {
                    errors.push('Missing email address.');
                }
                if (!newUserAttributes.password) {
                    errors.push('Missing password.');
                }
                if (errors.length) {
                    console.log("registration failed: " + JSON.stringify(errors));
                    return errors;
                }

                return {};
            })
            .registerUser( function (newUserAttributes) {
                var promise = this.Promise();

                var Model = db.model('user');
                var user = new Model(newUserAttributes);

                user.save(function (err) {
                    if (err) {
                        return promise.fail(err);
                    }
                    return promise.fulfill(user);
                });

                return promise;
            })
            .loginSuccessRedirect('/')
            .registerSuccessRedirect('/'); // Where to redirect to after a successful registration
    });
}());
