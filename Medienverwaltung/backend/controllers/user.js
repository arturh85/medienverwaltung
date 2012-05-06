(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        NotFound = module.parent.exports.NotFound,
        NotLoggedIn = module.parent.exports.NotLoggedIn;

    app.get('/user/me', function(req, res, next) {
        if(req.session.auth && req.session.auth.loggedIn){
            var Model = db.model('user');
            var userId = req.session.auth.userId;

            Model.findById(userId, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    return next(new NotFound());
                }

                res.header('Content-Type', 'application/json');
                res.send(doc.toObject(), 200);
            });
        } else {
            return next(new NotLoggedIn());
        }
    });
}());
