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

  res.status(404).send({error: "Endpoint not found"})
})



app.use((err, req, res, next) => {
    
})
module.exports = app;
