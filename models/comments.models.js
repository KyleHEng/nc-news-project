const db = require("../db/connection");
const { checkArticleID } = require("../utils");
function selectCommentsByArticleID(id) {
  return checkArticleID(id)
    .then(() => {
      return db.query(
        "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC",
        [id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { selectCommentsByArticleID };
