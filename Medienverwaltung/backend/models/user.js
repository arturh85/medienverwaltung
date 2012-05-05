
(function () {
    "use strict";

    var mongoose = require("mongoose");


    var User = new mongoose.Schema({
        email: String,
        password: String
    });

    mongoose.model('user', User);
}());
