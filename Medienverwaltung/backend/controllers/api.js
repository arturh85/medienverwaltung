(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        cfg = module.parent.exports.cfg,
        NotFound = module.parent.exports.nf;

    // FIND
    app.get('/api/:collection', function (req, res, next) {
        console.log("GET /api/" + req.params.collection);

        console.log(req.session);
        if(!req.session.auth || !req.session.auth.loggedIn){
            console.log("The user is NOT logged in");

            res.send("not logged in", 401);
            return ;

        }

        var Model = db.model(req.params.collection);
        var qw = Model.find({});

        if (req.param('query')) {
            qw.where(req.param('query'));
        }

        if (req.param('order')) {
            var order = [];
            req.param('order').forEach(function (dir, field) {
                order.push([field, dir]);
            });
            qw.sort(order);
        }

        if (req.param('limit')) {
            qw.limit(req.param('limit'));
        }

        if (req.param('offset')) {
            qw.skip(req.param('offset'));
        }

        qw.exec(function (err, docs) {
            if(err) {
                throw err;
            }

            var ret = [];
            docs.forEach(function (doc) {
                console.log(" - found: " + doc.toString());
                ret.push(doc.toObject());
            });

            if(ret.length === 0) {
                console.log(" - no results");
            }

            res.header('Content-Type', 'application/json');
            res.send(ret, 200);
        });
    });

    // READ
    app.get('/api/:collection/:id', function (req, res, next) {
        console.log("GET /api/" + req.params.collection + "/" + req.params.id);
        var Model = db.model(req.params.collection);

        Model.findById(req.params.id, function (err, doc) {
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
    });

    // CREATE
    var createDoc = function (req, res, next) {
        var Model = db.model(req.params.collection),
            doc = new Model(req.body);

        console.log("PUT /api/" + req.params.collection + " -> " + doc.toString());

        doc.save(function (err) {
            if(err) {
                throw err;
            }

            res.send(doc.toObject(), 201);
        });
    };

    app.put('/api/:collection', createDoc);
    app.post('/api/:collection', createDoc);

    // MODIFY
    var modifyDoc = function (req, res, next) {
        console.log("PUT /api/" + req.params.collection + "/" + req.params.id);
        var Model = db.model(req.params.collection);

        Model.findById(req.params.id, function (err, doc) {
            if(err) {
                throw err;
            }

            if (!doc) {
                console.log(" - not found");
                next(new NotFound());
            } else {
                console.log(" - no results");
                doc.merge(req.param(req.params.collection));

                doc.save(function () {
                    res.send(doc.toObject(), 200);
                });
            }
        });
    };

    app.put('/api/:collection/:id', modifyDoc);
    app.post('/api/:collection/:id', modifyDoc);

    // REMOVE
    app.del('/api/:collection/:id', function (req, res, next) {
        console.log("DELETE /api/" + req.params.collection + "/" + req.params.id);

        var Model = db.model(req.params.collection);

        Model.findById(req.params.id, function (err, doc) {
            if(err) {
                throw err;
            }

            if (!doc) {
                console.log(" - not found");
                next(new NotFound());
            } else {
                console.log(" - found: " + doc.toString());
                doc.remove(function () {
                    console.log(" - removed");
                    res.send('200 OK', 200);
                });
            }
        });
    });
}());
