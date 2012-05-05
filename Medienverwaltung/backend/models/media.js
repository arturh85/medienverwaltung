(function () {
    "use strict";

    var mongoose = require("mongoose");

    var Media = new mongoose.Schema({
        isbn: String,
        type: String,
        userId: String
    });

    mongoose.model('media', Media);
}());
