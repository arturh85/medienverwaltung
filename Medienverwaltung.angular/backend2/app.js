var application_root = __dirname,
    express = require("express"),
    path = require("path");

var app = express.createServer();

// Config
app.configure(function () {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/media', function (req, res) {
    res.send('Ecomm API is running');
});

// Launch server
app.listen("127.0.0.1", 4242);
