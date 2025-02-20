const {
  selectCommentsByArticleID,
  insertCommentByArticleId,
  sqlDeleteCommentByCommentID,
  updateCommentByCommentID,
} = require("../models/comments.models");

function getCommentsByArticleID(req, res, next) {
  const articleID = req.params.article_id;
  const queries = req.query;

  return selectCommentsByArticleID(articleID, queries)
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

function patchCommentByCommentID(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  return updateCommentByCommentID(comment_id, inc_votes)
    .then((commentInfo) => {
      res.status(200).send({ comment: commentInfo });
    })
    .catch((error) => {
      next(error);
    });
}
module.exports = {
  getCommentsByArticleID,
  postCommentByArticleId,
  deleteCommentByCommentID,
  patchCommentByCommentID,
};
