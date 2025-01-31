const express = require("express");
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticlesByID,
  getArticles,
  patchArticleByArticleID,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleID,
  postCommentByArticleId,
  deleteCommentByCommentID,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleID);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleByArticleID);

app.delete("/api/comments/:comment_id", deleteCommentByCommentID);

app.get("/api/users", getUsers);
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
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Required request details not found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  //500 error expected when there are bugs in code, or there are server issues
  //Might try to make test for this after finishing core tasks
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
