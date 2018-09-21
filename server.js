var express = require("express");
var bodyParser = require("body-parser");
let exphbs = require("express-handlebars");
// var logger = require("morgan");
var mongoose = require("mongoose");
let article_controller = require("./controller/articleController")
var axios = require("axios");
var cheerio = require("cheerio");
var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();


app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
app.use(article_controller)


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
