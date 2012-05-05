/* es5: true */
(function () {
    "use strict";

    // include node.js
    var application_root = __dirname,
        fs = require('fs'),
        sys = require('util'),
        fileExtension = require('path').extname,
        cfg;

    // include 3rd-party libraries
    var express = require('express'),
        mongoose = require('mongoose'),
        everyauth = module.exports.everyauth = require('everyauth');

    var serverAddress,
        serverPort,
        mode;

    // create server
    var app = module.exports.app = express.createServer();

    // load configuration
    try {
        cfg = module.exports.cfg = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
    } catch (e) {
        throw new Error("File config.json not found. Try: 'cp config.sample.json config.json'");
    }

    app.configure('development', function () {
        app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
        app.use(express.logger());
        //everyauth.debug = true;

        serverAddress = cfg.server.development.addr;
        serverPort = cfg.server.development.port;
        mode = "development";

        app.set('baseUrl', cfg.server.development.url);

        app.set('mongoUrl', 'mongodb://' + cfg.mongo.development.host + ':'
                                        + cfg.mongo.development.port + '/'
                                        + cfg.mongo.development.name);
    });

    app.configure('test', function () {
        serverAddress = cfg.server.test.addr;
        serverPort = cfg.server.test.port;
        mode = "test";

        app.set('baseUrl', cfg.server.test.url);

        app.set('mongoUrl', 'mongodb://' + cfg.mongo.test.host + ':'
                                         + cfg.mongo.test.port + '/'
                                         + cfg.mongo.test.name);
    });

    app.configure('production', function () {
        // enable logger
        app.use(express.logger());
        serverAddress = cfg.server.production.addr;
        serverPort = cfg.server.production.port;
        mode = "production";

        app.set('baseUrl', cfg.server.production.url);

        app.set('mongoUrl', 'mongodb://' + cfg.mongo.production.host + ':'
                                         + cfg.mongo.production.port + '/'
                                         + cfg.mongo.production.name);
    });

    // open db connection
    var db = module.exports.db = mongoose.connect(app.set('mongoUrl'), function (err) {
        if (err) throw err;
        console.log("connected to mongodb: " + app.set('mongoUrl'));
    });

    // define shortcut exceptions for setting correct HTTP status codes
    var NotFound = module.exports.NotFound = function (msg) {
        this.name = 'NotFound';
        Error.call(this, msg);
        //Error.captureStackTrace(this, arguments.callee);
    };
    sys.inherits(NotFound, Error);

    var NotLoggedIn = module.exports.NotLoggedIn = function (msg) {
        this.name = 'NotLoggedIn';
        Error.call(this, msg);
        //Error.captureStackTrace(this, arguments.callee);
    };
    sys.inherits(NotLoggedIn, Error);

    var NotAllowed = module.exports.NotAllowed = function (msg) {
        this.name = 'NotAllowed';
        Error.call(this, msg);
        //Error.captureStackTrace(this, arguments.callee);
    };
    sys.inherits(NotAllowed, Error);

    // file loader (for controllers, models, ...)
    var loadJsDirectory = function (dir) {
        fs.readdir(dir, function (err, files) {
            if (err) {
                throw err;
            }

            files.forEach(function (file) {
                if (fileExtension(file) === '.js') {
                    require(dir + '/' + file.replace('.js', ''));
                }
            });
        });
    };

    loadJsDirectory("./models");
    loadJsDirectory("./controllers");

    everyauth.openid
        .myHostname(app.set('baseUrl'))
        .openidURLField('openid_identifier') //The POST variable used to get the OpenID
        .sendToAuthenticationUri(function(req,res) {
            this.relyingParty.authenticate(req.query[this.openidURLField()], false, function(err,authenticationUrl){
                if(err) return p.fail(err);
                res.redirect(authenticationUrl);
            });
        })
        .simpleRegistration({
            "nickname": true, "email": true, "fullname": true, "dob": true, "gender": true,
            "postcode": true, "country": true, "language": true, "timezone" : true
        })
        .attributeExchange({
            "http://axschema.org/contact/email"       : "required"
        })
        .findOrCreateUser( function(session, openIdUserAttributes) {
            var Model = db.model('user');
            var qw = Model.findOne({claimedIdentifier: openIdUserAttributes.claimedIdentifier}, function(err, doc) {
                if(err) throw err;
                if(!doc){
                    doc = new Model(openIdUserAttributes);
                    doc.save(function (err) {
                        if(err) throw err;
                        return doc;
                    });
                }
                console.log("authenticated: " + JSON.stringify(doc));
                return doc;
            });
            return qw;
        })
        .redirectPath('/');

    app.configure(function(){
        app.use(express.static(application_root + "/../frontend/app"));
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'aj34jjSU4Z9!d$' }));
        app.use(express.methodOverride());
        app.use(everyauth.middleware());
        app.use(app.router);
        everyauth.helpExpress(app);
    });

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

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    /*
     app.get('/private', function(req, res){
     if(req.session.auth && req.session.auth.loggedIn){
     res.render('private', {title: 'Protected'});
     }else{
     console.log("The user is NOT logged in");
     res.redirect('/');
     }
     });
     */


    // start server
    app.listen(serverPort, serverAddress);
    console.log("server started in " + mode + " mode on http://" + serverAddress + ":" + serverPort);
}());
