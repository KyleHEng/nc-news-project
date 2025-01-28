const express = require("express");
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticlesByID,
  getArticles,
} = require("./controllers/articles.controller");
const {getCommentsByArticleID, postCommentByArticleId} = require("./controllers/comments.controller")

const app = express();

app.use(express.json())

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

//error handling middleware
app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  //500 error expected when there are bugs in code, or there are server issues
  //Might try to make test for this after finishing core tasks
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
