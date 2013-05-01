(function () {
    "use strict";

    var request = require('request');

    var app = module.parent.exports.app,
        db = module.parent.exports.db,
        cfg = module.parent.exports.cfg,
        NotAllowed = module.parent.exports.NotAllowed,
        NotFound = module.parent.exports.NotFound;

    function mapAmazonData(target, item) {
        target.title = item.ItemAttributes.Title;
        target.asin = item.ASIN;
        target.amazonDetailPageURL = item.DetailPageURL;
        target.author = item.ItemAttributes.Author;
        target.binding = item.ItemAttributes.Binding;
        target.pages = item.ItemAttributes.Pages;
        target.ean = item.ItemAttributes.EAN;
        target.isbn = item.ItemAttributes.ISBN;
        target.type = item.ItemAttributes.ProductGroup;
        target.publicationDate = item.ItemAttributes.PublicationDate;
        target.publisher = item.ItemAttributes.Publisher;
        target.studio = item.ItemAttributes.Studio;
        target.sku = item.ItemAttributes.SKU;
    }

    function getLargestImageUrl(item) {
        var largestImageUrl;

        if(item.LargeImage) {
            largestImageUrl = item.LargeImage.URL;
        } else if(item.MediumImage) {
            largestImageUrl = item.MediumImage.URL;
        } else if(item.SmallImage) {
            largestImageUrl = item.SmallImage.URL;
        }

        return largestImageUrl;
    }

    function fetchAmazonImage(item, callback) {
        var largestImageUrl = getLargestImageUrl(item);

        if(largestImageUrl !== undefined) {
            request({uri:largestImageUrl}, callback);
        } else {
            callback();
        }
    }

    var aws = require("aws-lib");
    var prodAdv = aws.createProdAdvClient(cfg.amazon.accessKeyId, cfg.amazon.secretAccessKey, cfg.amazon.associateTag);

    app.get('/amazon/search/:query', function(req, res) {
        prodAdv.call("ItemSearch", {SearchIndex: "Books", Title: req.params.query, ResponseGroup: "Images,ItemAttributes"}, function(err, result) {
            if(err) {
                throw err;
            }

            var items = result.Items.Item;

            var retArray = [];
			for(var i=0; i<items.length; i++) {
				var item = items[i];
                var ret = {};
                mapAmazonData(ret, item);
                ret.imageUrl = getLargestImageUrl(item);
                retArray.push(ret);
            }

            res.header('Content-Type', 'application/json');
            res.send(retArray, 200);
        });
    });

    app.get('/amazon/enrich/:id', function(req, res, next) {
        var searchIndex = "Books"; // TODO: make dynamic

        if(req.session.auth && req.session.auth.loggedIn){
            var Model = db.model('media');
            var userId = req.session.auth.userId;

            Model.findById(req.params.id, function (err, doc) {
                var itemId, idType;

                if(doc.isbn) {
                    itemId = doc.isbn;
                    idType = "ISBN";
                } else if(doc.ean) {
                    itemId = doc.ean;
                    idType = "EAN";
                } else {
                    return next(new NotFound());
                }

                prodAdv.call("ItemLookup", {
                    SearchIndex: searchIndex,
                    ItemId: itemId,
                    IdType: idType,
                    ResponseGroup: "Images,ItemAttributes"},
                    function(err, result) {
                        if(err) {
                            throw err;
                        }

                        var errors = result.Items.Request.Errors;

                        if(errors) {
                            console.log("ItemLookup failed: " + JSON.stringify(result.Items.Request.Errors));
                            return next(new NotFound());
                        } else {
                            var item = result.Items.Item;
                            console.log(JSON.stringify(item));

                            mapAmazonData(doc, item);
                            console.log(JSON.stringify(doc));

                            console.log(JSON.stringify(doc));


                            fetchAmazonImage(item, function (error, response, body) {
                                if (!error && response.statusCode === 200) {
                                    doc.image = body;
                                }

                                doc.save(function () {
                                    res.header('Content-Type', 'application/json');
                                    res.send(doc.toObject(), 200);
                                });
                            });
                        }
                    }
                );
            });
        } else {
            return next(new NotAllowed());
        }
    });
}());
