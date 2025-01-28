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

module.exports = { selectArticlesByID };
