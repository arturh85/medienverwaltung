(function () {
    "use strict";

    var mongoose = require("mongoose");

    var Media = new mongoose.Schema({
        isbn: String,
        ean: String,
        asin: String,

        type: String,
        userId: String,

        title: String,
        amazonDetailPageURL: String,
        author: String,
        binding: String,
        pages: Number,
        publicationDate: Date,
        publisher: String,
        studio: String,
        sku: String,

        imageUrl: String
    });

    mongoose.model('media', Media);
}());
