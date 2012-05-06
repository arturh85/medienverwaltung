(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        NotFound = module.parent.exports.NotFound,
        NotAllowed = module.parent.exports.NotAllowed,
        NotLoggedIn = module.parent.exports.NotLoggedIn;

    app.get('/media/:id/image', function(req, res, next) {
        if(req.session.auth && req.session.auth.loggedIn){
            var Model = db.model('media');
            var userId = req.session.auth.userId;

            Model.findById(req.params.id, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    return next(new NotFound());
                }
                if(doc.userId != userId) {
                    return next(new NotAllowed());
                }

                res.header('Content-Type', 'application/json');
                res.send(doc.toObject(), 200);
            });
        } else {
            return next(new NotLoggedIn());
        }
    });
}());
