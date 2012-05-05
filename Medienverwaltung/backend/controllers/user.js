(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        cfg = module.parent.exports.cfg,
        NotFound = module.parent.exports.nf;

    app.get('/user/me', function(req, res) {
        console.log("GET /user/me");
        if(req.session.auth && req.session.auth.loggedIn){
            var Model = db.model('user');

            var claimedIdentifier = req.session.auth.openid.user._conditions.claimedIdentifier;

            Model.findOne({claimedIdentifier: claimedIdentifier}, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    console.log(" - not found");
                    next(new NotFound());
                } else {
                    console.log(" - found: " + doc.toString());
                    res.header('Content-Type', 'application/json');
                    res.send(doc.toObject(), 200);
                }
            });
        }else{
            console.log("403: Not logged in");
            res.send('403 Not authorized', 403);
        }
    });
}());
