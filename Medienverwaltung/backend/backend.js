/* es5: true */
(function () {
    "use strict";

    var application_root = __dirname,
        fs = require('fs'),
        sys = require('util'),
        path = require('path'),
        extname = require('path').extname,
        cfg;

    // include 3rd-party libraries
    var express = require('express'),
        mongoose = require('mongoose');

    var program = require('commander');

    program
        .version('0.0.1')
        .option('-p, --production', 'run in production mode (default)')
        .option('-d, --development', 'run in development')
        .option('-t, --test', 'run in test mode')
        .parse(process.argv);

    // create server
    var app = module.exports.app = express.createServer();

    // configure server
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root + "/../frontend", "app")));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    app.set('views', __dirname + '/views');

    // load configuration
    try {
        cfg = module.exports.cfg = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
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
                if (extname(file) === '.js') {
                    require(dir + '/' + file.replace('.js', ''));
                }
            });
        });
    };

    // enable debugger
    if (true === cfg.debug) {
        app.use(express.errorHandler({
            showStack:true,
            dumpExceptions:true
        }));
    }

    // enable logger
    if (true === cfg.logger) {
        app.use(express.logger());
    }

    var NotFound = module.exports.nf = function (msg) {
        this.name = 'NotFound';
        Error.call(this, msg);
        //Error.captureStackTrace(this, arguments.callee);
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

    var mongoHost = cfg.mongo.production.host;
    var mongoPort = cfg.mongo.production.port;
    var mongoName = cfg.mongo.production.name;

    if(program.development) {
        mongoHost = cfg.mongo.development.host;
        mongoPort = cfg.mongo.development.port;
        mongoName = cfg.mongo.development.name;
    }
    if(program.test) {
        mongoHost = cfg.mongo.test.host;
        mongoPort = cfg.mongo.test.port;
        mongoName = cfg.mongo.test.name;
    }

    // open db connection
    var mongoUrl = 'mongodb://' + mongoHost + ':' + mongoPort + '/' + mongoName;
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

    var serverAddress = cfg.server.production.addr;
    var serverPort = cfg.server.production.port;
    var mode = "production";

    if(program.development) {
        serverAddress = cfg.server.development.addr;
        serverPort = cfg.server.development.port;
        mode = "development";
    }

    if(program.test) {
        serverAddress = cfg.server.test.addr;
        serverPort = cfg.server.test.port;
        mode = "test";
    }

    // start server
    app.listen(serverPort, serverAddress);

    console.log("server started in " + mode + " mode on http://" + serverAddress + ":" + serverPort);
}());
