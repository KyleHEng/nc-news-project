const {
  selectArticlesByID,
  selectArticles,
  updateArticleByArticleID,
  insertArticle,
} = require("../models/articles.models");

function getArticlesByID(req, res, next) {
  const articleID = req.params.article_id;

  return selectArticlesByID(articleID)
    .then((articleInfo) => {
      res.status(200).send({ article: articleInfo });
    })
    .catch((error) => {
      next(error);
    });
}

function getArticles(req, res, next) {
  const queries = req.query;
  return selectArticles(queries)
    .then((articleInfo) => {
      res.status(200).send({ articles: articleInfo });
    })
    .catch((error) => {
      next(error);
    });
}

function patchArticleByArticleID(req, res, next) {
  const { inc_votes } = req.body,
    { article_id } = req.params;

  return updateArticleByArticleID(inc_votes, article_id)
    .then((articleInfo) => {
      res.status(200).send({ article: articleInfo });
    })
    .catch((error) => {
      next(error);
    });
}

function postArticle(req, res, next) {
  const requestBody = req.body;
  const { author, title, body, topic } = requestBody;

  return insertArticle(author, title, body, topic)
    .then((articleInfo) => {
      res.status(201).send({ article: articleInfo });
    })
    .catch((error) => {
      next(error);
    });
}
module.exports = {
  getArticlesByID,
  getArticles,
  patchArticleByArticleID,
  postArticle,
};
