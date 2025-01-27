const { selectTopics } = require("../models/topics.model");

function getTopics(req, res, next) {
  console.log("boom");
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

module.exports = { getTopics };
