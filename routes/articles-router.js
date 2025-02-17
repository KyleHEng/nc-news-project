const {
  getArticlesByID,
  getArticles,
  patchArticleByArticleID,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleID,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticlesByID);

articlesRouter.get("/:article_id/comments", getCommentsByArticleID);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

articlesRouter.patch("/:article_id", patchArticleByArticleID);

module.exports = articlesRouter;
