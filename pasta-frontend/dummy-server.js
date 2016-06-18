var express = require("express");
var hbs = require("hbs");
var fs = require("fs");
var YAML = require("yamljs");
var livereload = require("connect-livereload");

var app = express();

var config = {
    HOST : "localhost",
    PORT : 8000
}

/* livereload */
app.use(livereload());

/* Serve Static file */
app.use(express.static(__dirname + "/src"));

/* Render Handlerbars */
//if want see "src/html/project/create.html", use "/project/create".
app.set("views", __dirname+ "/src/html");
app.set("view engine", "html");
app.set("view cache", false);
app.engine("html", hbs.__express);

hbs.registerPartials(__dirname + "/html/layout/");

var DUMMY_DATA_FILE_NAME = __dirname + "/dummy-data.yaml";
var data = YAML.load(DUMMY_DATA_FILE_NAME);

fs.watchFile(DUMMY_DATA_FILE_NAME, function(){
    console.log("reload dummy data")
    data = YAML.load(DUMMY_DATA_FILE_NAME); //reload data when changed
});

app.get(/\/(.*)$/, function(req, res){
    var viewName = req.params[0];
    res.render(viewName, data[viewName] || {});
});

/* Dummy APIs */
//TODO

/* start server */
var server = app.listen(config.PORT, config.HOST, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('custom server listening at %s:%s', host, port);
});
module.exports = app;
