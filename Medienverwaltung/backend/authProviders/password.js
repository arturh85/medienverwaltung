(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        authProviders = module.parent.exports.authProviders;

    var jshashes = require("jshashes");


    authProviders.push(function(everyauth) {
        everyauth.password
            .loginWith('email')
            .getLoginPath('/login') // Uri path to the login page
            .postLoginPath('/login') // Uri path that your login form POSTs to
            .getRegisterPath('/register') // Uri path to the registration page
            .postRegisterPath('/register') // The Uri path that your registration form POSTs to
            /*
            .simpleRegistration({
                "nickname": true, "email": true, "fullname": true, "dob": true, "gender": true,
                "postcode": true, "country": true, "language": true, "timezone" : true
            })*/
            .authenticate( function(login, password) {
                var promise
                    , errors = [];
                if (!login) errors.push('Missing login.');
                if (!password) errors.push('Missing password.');
                if (errors.length) return errors;

                console.log("authenticate");

                var userPromise = this.Promise();

                app.models.user.classicLogin(login, password, function(err, user) {
                    if (err) {
                        errors.push(err.message || err);
                        return userPromise.fulfill(errors);
                    }

                    if(!user) {
                        errors.push('User with login ' + login + ' does not exist.');
                        return promise.fulfill(errors);
                    }

                    console.log("authenticated: " + JSON.stringify(user));
                    return userPromise.fulfill(user);
                });

                return userPromise;
            })
            .validateRegistration( function (newUserAttributes) {
                // Validate the registration input
                // Return undefined, null, or [] if validation succeeds
                // Return an array of error messages (or Promise promising this array)
                // if validation fails
                //
                // e.g., assuming you define validate with the following signature
                // var errors = validate(login, password, extraParams);
                // return errors;
                //
                // The `errors` you return show up as an `errors` local in your jade template
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
