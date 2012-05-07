(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        authProviders = module.parent.exports.authProviders;

    authProviders.push(function(everyauth) {
        everyauth.openid
            .myHostname(app.set('baseUrl'))
            .openidURLField('openid_identifier') //The POST variable used to get the OpenID
            .sendToAuthenticationUri(function(req,res) {
                this.relyingParty.authenticate(req.query[this.openidURLField()], false, function(err,authenticationUrl){
                    if(err) {
                        return res.redirect("/#/login/error/" + err.message);
                    }
                    res.redirect(authenticationUrl);
                });
            })
            .simpleRegistration({
                "nickname": true, "email": true, "fullname": true, "dob": true, "gender": true,
                "postcode": true, "country": true, "language": true, "timezone" : true
            })
            .attributeExchange({
                "http://axschema.org/contact/email": "required"
            })
            .findOrCreateUser( function(session, openIdUserAttributes) {
                console.log("findOrCreateUser openid");
                var Model = db.model('user');

                var userPromise = this.Promise();

                var result = Model.findOne({claimedIdentifier: openIdUserAttributes.claimedIdentifier}, function(err, user) {
                    if (err) return userPromise.fail(err);
                    if (user) {
                        console.log("authenticated: " + JSON.stringify(user));
                        return userPromise.fulfill(user);
                    }

                    if(!user){
                        user = new Model();

                        user.claimedIdentifier = openIdUserAttributes.claimedIdentifier;
                        user.email = openIdUserAttributes.email;
                        user.fullname = openIdUserAttributes.fullname;
                        user.gender = openIdUserAttributes.gender;

                        user.openIdMetaData = openIdUserAttributes;

                        user.save(function (err) {
                            if(err) return userPromise.fail(err);
                            console.log("authenticated: " + JSON.stringify(user));
                            return userPromise.fulfill(user);
                        });
                    }
                    return user;
                });

                return userPromise;
            })
            .redirectPath('/');
    });
}());
