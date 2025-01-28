const { selectCommentsByArticleID } = require("../models/comments.models");

function getCommentsByArticleID(req, res, next) {
  const articleID = req.params.article_id;

  return selectCommentsByArticleID(articleID)
    .then((commentInfo) => {
      res.status(200).send({ comments: commentInfo });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getCommentsByArticleID };
