var app = module.parent.exports.app,
    db = module.parent.exports.db;

console.log("app: " + app.toString());

app.get('/amazon/search', function(req, res) {
    var prodAdv = aws.createProdAdvClient(yourAccessKeyId, yourSecretAccessKey, yourAssociateTag);

    prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: "Javascript"}, function(err, result) {
        console.log(JSON.stringify(result));
    })

    var ret = [];

    res.header('Content-Type', 'application/json');
    res.send(ret, 200);
});
