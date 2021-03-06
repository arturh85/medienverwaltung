/* es5: true */
(function () {
	"use strict";

	process.chdir(__dirname);

	// include node.js
	var application_root = __dirname,
		fs = require('fs'),
		sys = require('util'),
		fileExtension = require('path').extname,
		cfg;

	// include 3rd-party libraries
	var express = require('express'),
		mongoose = require('mongoose'),
		connect = require('connect'),
		everyauth = module.exports.everyauth = require('everyauth'),
		SessionStore = require("session-mongoose")(connect);

	var serverAddress,
		serverPort,
		mode;

	// create server
	var app = module.exports.app = express();

	// load configuration
	try {
		cfg = module.exports.cfg = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
	} catch (e) {
		throw new Error("File config.json not found. Try: 'cp config.sample.json config.json'");
	}

	app.configure('development', function () {
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
		app.use(express.logger());
		//everyauth.debug = true;

		serverAddress = cfg.server.development.addr;
		serverPort = cfg.server.development.port;
		mode = "development";

		app.set('baseUrl', cfg.server.development.url);

		app.set('mongoUrl', 'mongodb://' + cfg.mongo.development.host + ':'
			+ cfg.mongo.development.port + '/'
			+ cfg.mongo.development.name);

		app.set('mongoSessionUrl', 'mongodb://' + cfg.mongo.development.host + ':'
			+ cfg.mongo.development.port + '/'
			+ cfg.mongo.development.sessionName);
	});

	app.configure('test', function () {
		serverAddress = cfg.server.test.addr;
		serverPort = cfg.server.test.port;
		mode = "test";

		app.set('baseUrl', cfg.server.test.url);

		app.set('mongoUrl', 'mongodb://' + cfg.mongo.test.host + ':'
			+ cfg.mongo.test.port + '/'
			+ cfg.mongo.test.name);

		app.set('mongoSessionUrl', 'mongodb://' + cfg.mongo.test.host + ':'
			+ cfg.mongo.test.port + '/'
			+ cfg.mongo.test.sessionName);
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

		app.set('mongoSessionUrl', 'mongodb://' + cfg.mongo.production.host + ':'
			+ cfg.mongo.production.port + '/'
			+ cfg.mongo.production.sessionName);
	});

	// open mongodb connection
	var db = module.exports.db = mongoose.connect(app.set('mongoUrl'), function (err) {
		if (err) {
			throw err;
		}
		console.log("connected to mongodb: " + app.set('mongoUrl'));
	});

	var mongooseSessionStore = new SessionStore({
		url: app.set('mongoSessionUrl'),
		interval: 120000 // expiration check worker run interval in millisec (default: 60000)
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

	var ValidationFailed = module.exports.ValidationFailed = function (err) {
		this.name = 'ValidationFailed';

		console.log("validation failed");
		console.log(JSON.stringify(err));

		Error.call(this, err);
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
					console.log("require");
					require(dir + '/' + file.replace('.js', ''));
				}
			});
		});
	};
	// file loader (for controllers, models, ...)
	var loadJsDirectorySync = function (dir) {
		var files = fs.readdirSync(dir)
		for(var i=0; i<files.length; i++) {
			var file = files[i];
			if (fileExtension(file) === '.js') {
				require(dir + '/' + file.replace('.js', ''));
			}
		}
	};

	loadJsDirectorySync("./models");
	loadJsDirectorySync("./controllers");
	module.exports.authProviders = [];

	require("./authProviders/openid");
	require("./authProviders/facebook");
	require("./authProviders/password");

	module.exports.authProviders.forEach(function (registerAuthProvider) {
		registerAuthProvider(everyauth);
	});

	everyauth.everymodule
		.findUserById(function (userId, callback) {
			var Model = db.model('user');
			Model.findById(userId, callback);
		});


	app.configure(function () {
		app.use(express["static"](application_root + "/../frontend/app"));
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.bodyParser());
		app.use(express.cookieParser());
		app.use(express.session({
			secret: cfg.security.sessionSecret,
			store: mongooseSessionStore
		}));
		app.use(express.methodOverride());
		app.use(everyauth.middleware());
		app.use(app.router);
		app.use(function (err, req, res, next) {
			if (err instanceof NotFound) {
				var msg = '404 Not found';
				res.send(msg, 404);
			} else  if (err instanceof NotAllowed) {
				var msg = '403 Forbidden';
				res.send(msg, 403);
			} else if (err instanceof NotLoggedIn) {
				var msg = '401 Unauthorized';
				res.send(msg, 401);
			} else if (err instanceof ValidationFailed) {
				console.log("SENDING " + JSON.stringify(err.msg));
				res.send(err.msg, 400);
			} else {
				console.log("unhandled error: " + err);
				res.send(500, 'Something broke!');
			}
		});
	});


	// start server
	app.listen(serverPort, serverAddress);
	console.log("server started in " + mode + " mode on http://" + serverAddress + ":" + serverPort);

	// expose app
	exports = module.exports = app
}());
