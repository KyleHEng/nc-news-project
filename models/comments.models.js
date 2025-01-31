const db = require("../db/connection");
const { checkArticleID, checkUsername } = require("../utils");

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

function insertCommentByArticleId(name, body, id) {
  return checkArticleID(id)
    .then(() => {
      return db.query(
        `
      INSERT INTO comments
        (author, body, article_id)
      VALUES
        ($1, $2, $3)
      RETURNING *
      `,
        [name, body, id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

function sqlDeleteCommentByCommentID(id) {
  return db.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1;
    `,
    [id]
  )
  .then(({rowCount}) => {
    if(rowCount === 0) return Promise.reject({status: 404, msg: "Comment ID not found"});
    return;
  });
}
module.exports = {
  selectCommentsByArticleID,
  insertCommentByArticleId,
  sqlDeleteCommentByCommentID,
};
