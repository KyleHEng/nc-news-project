const {
  selectCommentsByArticleID,
  insertCommentByArticleId,
  sqlDeleteCommentByCommentID,
} = require("../models/comments.models");

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

function postCommentByArticleId(req, res, next) {
  const { username, body } = req.body,
    { article_id } = req.params;

  return insertCommentByArticleId(username, body, article_id)
    .then((commentInfo) => {
      res.status(201).send({ comment: commentInfo });
    })
    .catch((error) => {
      next(error);
    });
}

function deleteCommentByCommentID(req, res, next) {
  const { comment_id } = req.params;

  return sqlDeleteCommentByCommentID(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
}
module.exports = {
  getCommentsByArticleID,
  postCommentByArticleId,
  deleteCommentByCommentID,
};
