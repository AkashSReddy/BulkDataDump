var createError = require("http-errors");
var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
require("dotenv").config();
var app = express();
const Q_Database = require("./model/question");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useFindAndModify: false },
  err => {
    if (!err) console.log("Connection successful");
  }
);

const csvFilePath = "/home/akash/Desktop/dataScript/data.csv";
const csv = require("csvtojson");
csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    let questions = jsonObj.map(data => {
      return {
        qid: 2,
        question: data.question,
        qDomain: data.domain.toLowerCase(),
        answer: data.answer
      };
    });
    for (var i = 0; i < questions.length; i++) {
      questions[i] = new Q_Database({
        qid: questions[i].qid,
        question: questions[i].question,
        answer: questions[i].answer,
        qDomain: questions[i].qDomain
      });
      questions[i].save(function(err, data) {
        if (err) {
          console.log("error");
        } else {
          console.log("We just saved something");
          console.log(data);
        }
      });
    }
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
