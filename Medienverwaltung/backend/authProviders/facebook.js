(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        cfg = module.parent.exports.cfg,
        authProviders = module.parent.exports.authProviders;


    authProviders.push(function(everyauth) {
        everyauth.facebook
            .myHostname(app.set('baseUrl'))
            .appId(cfg.facebook.appId)
            .appSecret(cfg.facebook.appSecret)
            .scope('email')
            .handleAuthCallbackError( function (req, res) {
                // If a user denies your app, Facebook will redirect the user to
                // /auth/facebook/callback?error_reason=user_denied&error=access_denied&error_description=The+user+denied+your+request.
                // This configurable route handler defines how you want to respond to
                // that.
                // If you do not configure this, everyauth renders a default fallback
                // view notifying the user that their authentication failed and why.
                console.log("Facebook auth failed: " + JSON.stringify(req.params));
                res.redirect("/#/login/error/Facebook Login failed");
            })
            .findOrCreateUser( function(session, accessToken, accessTokenExtra, fbUserMetadata) {
                console.log("findOrCreateUser facebook");
                var Model = db.model('user');

                var userPromise = this.Promise();

                var result = Model.findOne({fbId: fbUserMetadata.id}, function(err, user) {
                    if (err) {
                        return userPromise.fail(err);
                    }

                    if (user) {
                        console.log("authenticated: " + JSON.stringify(user));
                        return userPromise.fulfill(user);
                    }

                    if(!user){
                        user = new Model();

                        // map attributes to user schema
                        user.fbId = fbUserMetadata.id;
                        user.fullname = fbUserMetadata.name;
                        user.fbLink = fbUserMetadata.link;
                        user.email = fbUserMetadata.email;
                        user.gender = fbUserMetadata.gender === "male" ? "m" : "f";

                        // preserve original metadata
                        user.facebookMetaData = fbUserMetadata;

                        try {
                            user.save(function (err) {
                                if(err) {
                                    return userPromise.fail(err);
                                }
                                console.log("authenticated: " + JSON.stringify(user));
                                return userPromise.fulfill(user);
                            });
                        } catch(e) {
                            console.log("error saving user: " + JSON.stringify(e));
                            return userPromise.fail(e);
                        }
                    }
                });

                return userPromise;
            })
            .redirectPath('/');
    });
}());
