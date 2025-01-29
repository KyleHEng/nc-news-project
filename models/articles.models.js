const db = require("../db/connection");
const { checkArticleID } = require("../utils");

function selectArticlesByID(id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article ID not found" });
      return rows[0];
    });
}

function selectArticles() {
  return db
    .query(
      `
        SELECT articles.*, COUNT(comment_id)::INT as comment_count 
        FROM articles 
        JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id;
        `
    )
    .then(({ rows }) => {
      return rows;
    });
}

function updateArticleByArticleID(voteIncrement, id) {
  return checkArticleID(id).then(() => {
    return db
      .query(
        `
      UPDATE articles
      SET
        votes = votes + $1
      WHERE
        article_id = $2
      RETURNING *;
      `,
        [voteIncrement, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
}

module.exports = {
  selectArticlesByID,
  selectArticles,
  updateArticleByArticleID,
};
