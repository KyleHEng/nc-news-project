const {
  getArticlesByID,
  getArticles,
  patchArticleByArticleID,
  postArticle,
} = require("../controllers/articles.controller");

const {
  getCommentsByArticleID,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticlesByID)
  .patch(patchArticleByArticleID);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleID)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
