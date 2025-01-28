const express = require("express");
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const app = express();

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

//error handling middleware
app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  //500 error expected when there are bugs in code, or there are server issues
  //Might try to make test for this after finishing core tasks
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = app;
