const db = require("../db/connection");

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

module.exports = { selectArticlesByID, selectArticles };
