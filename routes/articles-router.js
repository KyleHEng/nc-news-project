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

articlesRouter
  .route("/:article_id")
  .get(getArticlesByID)
  .patch(patchArticleByArticleID);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
