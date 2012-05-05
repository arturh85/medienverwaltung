(function () {
    "use strict";

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        cfg = module.parent.exports.cfg,
        NotFound = module.parent.exports.NotFound;

    var aws = require("aws-lib");
    var prodAdv = aws.createProdAdvClient(cfg.amazon.accessKeyId, cfg.amazon.secretAccessKey, cfg.amazon.associateTag);

    app.get('/amazon/search/:query', function(req, res) {
        console.log("GET /amazon/search/" + req.params.query);

        prodAdv.call("ItemSearch", {SearchIndex: "Books", Title: req.params.query, ResponseGroup: "Images,ItemAttributes"}, function(err, result) {
            if(err) {
                throw err;
            }

            var ret = result.Items.Item;
            res.header('Content-Type', 'application/json');
            res.send(ret, 200);
        });
    });

    app.get('/amazon/isbn/:isbn', function(req, res, next) {
        console.log("GET /amazon/isbn/" + req.params.isbn);

        prodAdv.call("ItemLookup", {SearchIndex: "Books", ItemId: req.params.isbn, IdType: 'ISBN', ResponseGroup: "Images,ItemAttributes"}, function(err, result) {
            console.log("result");
            console.log(JSON.stringify(result));

            if(err) {
                throw err;
            }

            if(result.Items.Request.Errors) {
                console.log("ItemLookup failed: " + JSON.stringify(result.Items.Request.Errors));
                next(new NotFound());
            } else {
                var ret = result.Items.Item;
                res.header('Content-Type', 'application/json');
                res.send(ret, 200);
            }
        });
    });
}());
