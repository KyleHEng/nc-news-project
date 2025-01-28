const {
  selectArticlesByID,
  selectArticles,
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
  return selectArticles()
    .then((articleInfo) => {
      res.status(200).send({ articles: articleInfo });
    })
    .catch((error) => {
      next(error);
    });
}

module.exports = { getArticlesByID, getArticles };
