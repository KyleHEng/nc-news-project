const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

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
