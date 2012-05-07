(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        authProviders = module.parent.exports.authProviders;

    authProviders.push(function(everyauth) {
        everyauth.password
            .loginWith('email')
            .getLoginPath('/#/login') // Uri path to the login page
            .postLoginPath('/login') // Uri path that your login form POSTs to
            .getRegisterPath('/#/register') // Uri path to the registration page
            .postRegisterPath('/register') // The Uri path that your registration form POSTs to
            .addToSession( function (sess, user, errors) {
                var _auth = sess.auth || (sess.auth = {});
                if (user)
                    _auth.userId = user.id;
                _auth.loggedIn = !!user;
                _auth.loginMethod = 'password';
            })
            .authenticate( function(login, password) {
                var promise
                    , errors = [];
                if (!login) errors.push('Missing login.');
                if (!password) errors.push('Missing password.');
                if (errors.length) return errors;

                console.log("password authentication");

                var userPromise = this.Promise();

                app.models.user.classicLogin(login, password, function(err, user) {
                    if (err) {
                        errors.push(err.message || err);
                        return userPromise.fulfill(errors);
                    }

                    if(!user) {
                        var msg = 'User with login ' + login + ' does not exist.';
                        console.log(msg);
                        errors.push(msg);
                        return promise.fulfill(errors);
                    }

                    console.log("authenticated: " + JSON.stringify(user));
                    return userPromise.fulfill(user);
                });

                return userPromise;
            })
            .validateRegistration( function (newUserAttributes) {
                var errors = [];
                if (!newUserAttributes.email) errors.push('Missing email address.');
                if (!newUserAttributes.password) errors.push('Missing password.');
                if (errors.length) return errors;
            })
            .registerUser( function (newUserAttributes) {
                var promise = this.Promise()
                    , password = newUserAttributes.password;

                var Model = db.model('user');
                var user = new Model(newUserAttributes);

                user.save(function (err) {
                    if (err) return promise.fail(err);
                    return promise.fulfill(user);
                });

                return promise;
            })
            .registerSuccessRedirect('/'); // Where to redirect to after a successful registration
    });
}());
