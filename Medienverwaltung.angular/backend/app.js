/* es5: true */
(function () {
    "use strict";

    var application_root = __dirname,
        fs = require('fs'),
        sys = require('util'),
        path = require('path'),
        extname = require('path').extname;

    // include 3rd-party libraries
    var express = require('express'),
        mongoose = require('mongoose');

    // create server
    var app = module.exports.app = express.createServer();

    // configure server
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root + "/../", "app")));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    app.set('views', __dirname + '/views');

    // load configuration
    try {
        var cfg = module.exports.cfg = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
    } catch (e) {
        throw new Error("File config.json not found. Try: 'cp config.json.sample config.json'");
    }

    // file loader (for controllers, models, ...)
    var loader = function (dir) {
        fs.readdir(dir, function (err, files) {
            if (err) {
                throw err;
            }

            files.forEach(function (file) {
                if (extname(file) == '.js') {
                    require(dir + '/' + file.replace('.js', ''));
                }
            });
        });
    };

    // enable debugger
    if (true == cfg.debug) {
        app.use(express.errorHandler({
            showStack:true,
            dumpExceptions:true
        }));
    }

    // enable logger
    if (true == cfg.logger) {
        app.use(express.logger());
    }

    var NotFound = module.exports.nf = function (msg) {
        this.name = 'NotFound';
        Error.call(this, msg);
        Error.captureStackTrace(this, arguments.callee);
    };

    sys.inherits(NotFound, Error);

    // Error 404
    app.error(function (err, req, res, next) {
        if (err instanceof NotFound) {
            res.send('404 Not found', 404);
        } else {
            next(err);
        }
    });

    // Error 500
    app.error(function (err, req, res) {
        res.send('500 Internal server error', 500);
    });

    // open db connection
    var mongoUrl = 'mongodb://' + cfg.mongo.host + ':' + cfg.mongo.port + '/' + cfg.mongo.name;
    var db = module.exports.db = mongoose.connect(mongoUrl, function (err) {
        if (err) {
            throw err;
        }

        console.log("connected to mongodb: " + mongoUrl);
    });

    // load models
    cfg.loader.models.forEach(loader);

    // load controllers
    cfg.loader.controllers.forEach(loader);

    // load default controller
    if (cfg.loader.use_default_controller) {
        // FIND
        app.get('/api/:collection', function (req, res, next) {
            console.log("GET /api/" + req.params.collection);

            var col = db.model(req.params.collection);
            var qw = col.find({});

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

                if(ret.length == 0) {
                    console.log(" - no results");
                }

                res.header('Content-Type', 'application/json');
                res.send(ret, 200);
            });
        });

        // READ
        app.get('/api/:collection/:id', function (req, res, next) {
            console.log("GET /api/" + req.params.collection + "/" + req.params.id);
            var col = db.model(req.params.collection);

            col.findById(req.params.id, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    console.log(" - not found");
                    next(new NotFound);
                } else {
                    console.log(" - found: " + doc.toString());
                    res.header('Content-Type', 'application/json');
                    res.send(doc.toObject(), 200);
                }
            });
        });

        // CREATE
        var createDoc = function (req, res, next) {
            var col = db.model(req.params.collection),
                doc = new col(req.body);

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
            var col = db.model(req.params.collection);

            col.findById(req.params.id, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    console.log(" - not found");
                    next(new NotFound);
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

            var col = db.model(req.params.collection);

            col.findById(req.params.id, function (err, doc) {
                if(err) {
                    throw err;
                }

                if (!doc) {
                    console.log(" - not found");
                    next(new NotFound);
                } else {
                    console.log(" - found: " + doc.toString());
                    doc.remove(function () {
                        console.log(" - removed");
                        res.send('200 OK', 200);
                    });
                }
            });
        });
    }

    // start server
    app.listen(cfg.server.port, cfg.server.addr);

    console.log("server started on http://" + cfg.server.addr + ":" + cfg.server.port);

}());
