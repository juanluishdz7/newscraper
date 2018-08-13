var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var db = require("./models");
var app = express();
var PORT = process.env.PORT || 3000;


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// If deployed, use the deployed database. Otherwise use the local database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newscraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect('mongodb://heroku_3dptfzqh:34aa9ifb9457eko9rpo4ecr516@ds119442.mlab.com:19442/heroku_3dptfzqh');
//routes
app.get("/scrape", function(req, res) {
  request("https://www.infoworld.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    $(".item h4").each(function(i, element) {
      var result = {};
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");
      db.article.create(result)
        .then(function(dbarticle) {
          console.log(dbarticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape complete");

  });
});

app.get("/articles", function(req, res) {
  db.article.find({})
  .then(function(dbarticle) {
    res.json(dbarticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.get("/articles/:id", function(req, res) {
  db.article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbarticle) {
      res.json(dbarticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.note.create(req.body)
    .then(function(dbnote) {
      return db.article.findOneAndUpdate({ _id: req.params.id}, { note: dbnote._id}, { new: true});
    })
    .then(function(dbarticle) {
      res.json(dbarticle);
    })
    .catch(function(err) {
      res.json(err);
    });

});

app.delete("/articles/", function(req, res) {
  db.note.delete(req.body)
    .then(function(dbnote) {
      return db.article.findOneAndRemove({ _id: req.params.id}, { note: dbnote._id}, { new: true});
    })
    .then(function(dbarticle) {
      res.send("note deleted");
    });
});

// Start the server
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port " + PORT + "!");
});
