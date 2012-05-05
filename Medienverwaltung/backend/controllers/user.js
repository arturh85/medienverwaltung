(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        cfg = module.parent.exports.cfg,
        NotFound = module.parent.exports.NotFound,
        NotLoggedIn = module.parent.exports.NotLoggedIn;

    app.get('/user/me', function(req, res, next) {
        if(req.session.auth && req.session.auth.loggedIn){
            var Model = db.model('user');

            console.log(JSON.stringify(req.session.auth));
            var claimedIdentifier = req.session.auth.openid.user._conditions.claimedIdentifier;

            Model.findOne({claimedIdentifier: claimedIdentifier}, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    next(new NotFound());
                } else {
                    console.log(" - found: " + doc.toString());
                    res.header('Content-Type', 'application/json');
                    res.send(doc.toObject(), 200);
                }
            });
        }else{
            next(new NotLoggedIn());
        }
    });
}());
