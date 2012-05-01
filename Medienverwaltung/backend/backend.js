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
        mongoose = require('mongoose'),
        everyauth = require('everyauth'),
        connect = require('connect');

    var program = require('commander');

    program
        .version('0.0.1')
        .option('-p, --production', 'run in production mode (default)')
        .option('-d, --development', 'run in development')
        .option('-t, --test', 'run in test mode')
        .parse(process.argv);

    //everyauth.debug = true;

    var usersById = {};
    var nextUserId = 0;

    function addUser (source, sourceUser) {
        var user;
        if (arguments.length === 1) { // password-based
            user = source;
            //sourceUser = source;
            nextUserId += 1;
            user.id = nextUserId;
            usersById[nextUserId] = user;
        } else { // non-password-based
            user = usersById[++nextUserId] = {id: nextUserId};
            user[source] = sourceUser;
        }
        return user;
    }
    var usersByLogin = {
        'arturh@arturh.de': addUser({ login: 'arturh@arturh.de', password: 'hhag'})
    };

    everyauth.everymodule
        .findUserById( function (id, callback) {
        callback(null, usersById[id]);
    });
    everyauth
        .password
        .loginWith('email')
        .respondToLoginSucceed( function (res, user) {
            console.log("respondToLoginSucceed")
            if (user) { /* Then the login was successful */
                console.log("sending login success!");
                res.json({ success: true }, 200);
            }
        })
        .respondToLoginFail( function (req, res, errors, login) {
            console.log("respondToLoginFail")
            if (!errors || !errors.length) return;
            return res.json({ success: false, errors: errors });
        })
        .getLoginPath("/login")
        .postLoginPath('/login')
        .authenticate( function (login, password) {
            var errors = [];

            if (!login) {
                errors.push('Missing login');
            }
            if (!password) {
                errors.push('Missing password');
            }
            if (errors.length) {
                return errors;
            }

            var user = usersByLogin[login];
            if (!user) {
                return ['Login failed'];
            }
            if (user.password !== password) {
                return ['Login failed'];
            }
            return user;
        })

        .getRegisterPath('/register')
        .postRegisterPath('/register')
        .registerView('register.jade')
// .registerLocals({
// title: 'Register'
// })
// .registerLocals(function (req, res) {
// return {
// title: 'Sync Register'
// }
// })
        .registerLocals( function (req, res, done) {
            setTimeout( function () {
                done(null, {
                    title: 'Async Register'
                });
            }, 200);
        })
        .validateRegistration( function (newUserAttrs, errors) {
            var login = newUserAttrs.login;
            if (usersByLogin[login]) {
                errors.push('Login already taken');
            }
            return errors;
        })
        .registerUser( function (newUserAttrs) {
            var login = newUserAttrs[this.loginKey()];
            var user = addUser(newUserAttrs);
            usersByLogin[login] = user;
            return user;
        })

        .loginSuccessRedirect('/')
        .registerSuccessRedirect('/');

    /*
    var app = module.exports.app = express.createServer(
        express.bodyParser()
        , express.static(__dirname + "/../frontend/app")
        , express.favicon()
        , express.cookieParser()
        , express.session({ secret: 'htuayreve'})
        , everyauth.middleware()
    );*/

    // create server
    var app = module.exports.app = express.createServer();


     // configure server
     app.use(express.bodyParser());
     app.use(express.methodOverride());
     //app.use(app.router);
     //app.use(everyauth.middleware());
     app.use(express.static(path.join(application_root + "/../frontend", "app")));
     app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
     app.set('views', __dirname + '/views');

    app.configure(function(){
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.cookieParser());
        app.use(express.session({ secret: 'aj34jjSU4Z9!d$' }));
        app.use(express.bodyParser());
        app.use(everyauth.middleware());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(application_root + "/../frontend", "app")));
        everyauth.helpExpress(app);
    });

    app.configure('development', function(){
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });

    app.configure('production', function(){
        app.use(express.errorHandler());
    });

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


    app.get('/private', function(req, res){
        /*console.log(req.session);*/
        if(req.session.auth && req.session.auth.loggedIn){
            res.render('private', {title: 'Protected'});
        }else{
            console.log("The user is NOT logged in");
            /*console.log(req.session);*/
            res.redirect('/');
        }
    });



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
