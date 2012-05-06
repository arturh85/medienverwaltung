(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        NotFound = module.parent.exports.NotFound,
        NotAllowed = module.parent.exports.NotAllowed,
        NotLoggedIn = module.parent.exports.NotLoggedIn;

    // Error 401
    app.error(function (err, req, res, next) {
        if (err instanceof NotLoggedIn) {
            var msg = '401 Unauthorized';
            //console.log(msg + ": " + JSON.stringify(req));
            res.send(msg, 401);
        } else {
            next(err);
        }
    });

    // Error 403
    app.error(function (err, req, res, next) {
        if (err instanceof NotAllowed) {
            var msg = '403 Forbidden';
            //console.log(msg + ": " + JSON.stringify(req));
            res.send(msg, 403);
        } else {
            next(err);
        }
    });

    // Error 404
    app.error(function (err, req, res, next) {
        if (err instanceof NotFound) {
            var msg = '404 Not found';
            //console.log(msg + ": " + JSON.stringify(req));
            res.send(msg, 404);
        } else {
            next(err);
        }
    });

    // Error 500
    app.error(function (err, req, res) {
        var msg = '500 Internal server error';
        //console.log(msg + ": " + req.url);
        res.send(msg, 500);
    });

}());
