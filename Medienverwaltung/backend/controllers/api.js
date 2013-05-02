(function () {
	"use strict";

	var app = module.parent.exports.app,
		db = module.parent.exports.db,
		NotFound = module.parent.exports.NotFound,
		NotAllowed = module.parent.exports.NotAllowed,
		ValidationFailed = module.parent.exports.ValidationFailed,
		NotLoggedIn = module.parent.exports.NotLoggedIn;

	// FIND
	app.get('/api/:collection', function (req, res, next) {
		if (!req.session.auth || !req.session.auth.loggedIn) {
			return next(new NotLoggedIn());
		}

		var Model = db.model(req.params.collection);
		var qw = Model.find({});

		var userId = req.session.auth.userId;

		qw.where('userId', userId);

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
			if (err) {
				throw err;
			}

			var ret = [];
			docs.forEach(function (doc) {
				//console.log(" - found: " + doc.toString());
				ret.push(doc.toObject());
			});

			if (ret.length === 0) {
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
			if (err) {
				throw err;
			}
			var userId = req.session.auth.userId;
			if (doc.userId !== userId) {
				return next(new NotAllowed());
			}
			if (!doc) {
				return next(new NotFound());
			}
			//console.log(" - found: " + doc.toString());
			res.header('Content-Type', 'application/json');
			res.send(doc.toObject(), 200);
		});
	});

	var createDoc = function (req, res, next) {
		// CREATE
		console.log(req.method + " /api/" + req.params.collection + " with " + JSON.stringify(req.params));
		console.log("body: " + req.body);

		var Model = db.model(req.params.collection),
			doc = new Model(req.body);

		var userId = null;
		if (req.session) {
			userId = req.session.auth.userId;
		}
		if (req.params.collection != 'user' && !userId) {
			return next(new NotAllowed());
		} else {
			doc.ownerUserId = userId;
		}
		doc.save(function (err) {
			if (err) {
				if(err.name == 'ValidationError') {
					return next(new ValidationFailed(err));
				}
				throw err;
			}
			res.send(doc.toObject(), 201);
		});
0	};

	app.put('/api/:collection', createDoc);
	app.post('/api/:collection', createDoc);

	// MODIFY
	var modifyDoc = function (req, res, next) {
		var Model = db.model(req.params.collection);

		Model.findById(req.params.id, function (err, doc) {
			if (err) {
				throw err;
			}

			if (!doc) {
				return next(new NotFound());
			}

			// check authorisation
			var userId = req.session.auth.userId;
			if (doc.userId !== userId) {
				return next(new NotAllowed());
			}

			console.log(" - no results");
			doc.merge(req.param(req.params.collection));

			doc.save(function () {
				res.send(doc.toObject(), 200);
			});
		});
	};

	app.put('/api/:collection/:id', modifyDoc);
	app.post('/api/:collection/:id', modifyDoc);

	// REMOVE
	app.del('/api/:collection/:id', function (req, res, next) {
		var Model = db.model(req.params.collection);

		Model.findById(req.params.id, function (err, doc) {
			if (err) {
				throw err;
			}

			if (!doc) {
				return next(new NotFound());
			}

			// check authorisation
			var userId = req.session.auth.userId;
			if (doc.userId !== userId) {
				return next(new NotAllowed());
			}

			doc.remove(function () {
				console.log("DELETED: " + doc.toString());
				res.send('200 OK', 200);
			});
		});
	});
}());
