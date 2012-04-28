var app = module.parent.exports.app,
    db = module.parent.exports.db,
    cfg = module.parent.exports.cfg;

var aws = require("aws-lib");

app.get('/amazon/search/:query', function(req, res) {
    console.log("GET /amazon/search/" + req.params.query);
    var prodAdv = aws.createProdAdvClient(cfg.amazon.accessKeyId, cfg.amazon.secretAccessKey, cfg.amazon.associateTag);

    prodAdv.call("ItemSearch", {SearchIndex: "Books", Title: req.params.query, ResponseGroup: "Images,ItemAttributes"}, function(err, result) {
        var ret = result.Items.Item;
        res.header('Content-Type', 'application/json');
        res.send(ret, 200);
    });
});
