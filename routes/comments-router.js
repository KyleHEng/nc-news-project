const {
  deleteCommentByCommentID,
} = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentByCommentID);

module.exports = commentsRouter;
