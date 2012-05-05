(function () {
    "use strict";

    var mongoose = require("mongoose");

    var User = new mongoose.Schema({
        claimedIdentifier: String,
        email: String
    });

    mongoose.model('user', User);
}());
