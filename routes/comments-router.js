const {
  deleteCommentByCommentID,
  patchCommentByCommentID,
} = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentByCommentID);

commentsRouter.patch("/:comment_id", patchCommentByCommentID);
module.exports = commentsRouter;
