var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");
var bodyParser = require("body-parser");
var app = express();

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/news-scraper2");

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  axios.get("https://old.reddit.com/").then(function (response) {
    var $ = cheerio.load(response.data);
    var results = {}
    $("a.title").each(function (i, element) {

      results.title = $(element).text();
      results.link = $(element).attr("href");
      db.Article.create(results)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {

          return res.json(err);
        });
    });
    res.send("Scrape Complete")
  });
});

// Route for getting all Articles from the db
app.get("/", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.render("index", {
        data: {
          dbArticle
        }
      });
    })
    .catch(function (err) {
      res.json(err);
    });
});

// get saved articles
app.get("/saved-articles", function (req, res) {
  db.Article.find({
      saved: true
    })
    .then(function (savedArticles) {
      res.render("savedArticles", {
        data: {
          savedArticles
        }
      });
    })
    .catch(function (err) {
      res.json(err);
    });
});

//save an article
app.post("/save-articles/:id", function (req, res) {
  db.Article.update({
      _id: req.params.id
    }, {
      $set: {
        saved: true
      }
    })
    .then(function (article) {
      res.json(article);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (articleNote) {
      console.log(articleNote)
      res.render("comment", {
        data: {
          articleNote
        }
      });
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        $push: {
          note: dbNote._id
        }
      }, {
        upsert: true
      });
      // { note: dbNote._id }, 
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

//delete note route
app.delete("/delete-note/:id", function (req, res) {
  console.log(req.params)
  db.Article.update({}, {
      $pull: {
        note: {
          $in: [req.params.id]
        }
      }
    },  { multi: true })
    .then(function (article) {
      console.log(article)
      res.json(article);
    })
    .catch(function (err) {
      res.json(err);
    });
});

module.exports = app;