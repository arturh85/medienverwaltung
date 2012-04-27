var mongoose = require("mongoose");

var Media = new mongoose.Schema({
    isbn: String
});

mongoose.model('media', Media);