const db = require("../db/connection");
const { checkArticleID, checkUsername } = require("../utils");

function selectCommentsByArticleID(id, queries) {
  let sort_by = queries.sort_by || "created_at";
  let order = queries.order || "desc";
  let sqlString = "SELECT * FROM comments WHERE article_id = $1";
  const dbArgs = [id];
  if (sort_by) {
    const validColumnNamesToSortBy = ["author", "created_at", "votes"];

    if (!validColumnNamesToSortBy.includes(sort_by)) {
      sort_by = "created_at";
    }
    sqlString += ` ORDER BY ${sort_by}`;

    if (order !== "desc" && order !== "asc") {
      order = "desc";
    }
    sqlString += ` ${order}`;
  }

  return checkArticleID(id)
    .then(() => {
      return db.query(sqlString, dbArgs);
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
  return db
    .query(
      `
    DELETE FROM comments
    WHERE comment_id = $1;
    `,
      [id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0)
        return Promise.reject({ status: 404, msg: "Comment ID not found" });
      return;
    });
}

function updateCommentByCommentID(id, inc_vote) {
  return db
    .query(
      `
    UPDATE comments
    SET
      votes = votes + $1
    WHERE comment_id = $2
    RETURNING *;
    `,
      [inc_vote, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}
module.exports = {
  selectCommentsByArticleID,
  insertCommentByArticleId,
  sqlDeleteCommentByCommentID,
  updateCommentByCommentID,
};
