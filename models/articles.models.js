const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");
const { checkArticleID } = require("../utils");

function selectArticlesByID(id) {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id)::INT as comment_count
  FROM articles
  JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article ID not found" });
      return rows[0];
    });
}

function selectArticles(queries) {
  let sort_by = queries.sort_by || "created_at";
  let order = queries.order || "desc";
  const topic = queries.topic;

  let SQLString = `
        SELECT articles.*, COUNT(comment_id)::INT as comment_count 
        FROM articles 
        JOIN comments ON comments.article_id = articles.article_id
        `;

  const dbArgs = [];
  if (topic) {
    SQLString += `WHERE topic = $1 `;
    dbArgs.push(topic);
  }

  SQLString += "GROUP BY articles.article_id ";

  if (sort_by) {
    const validColumnNamesToSortBy = [
      "title",
      "topic",
      "author",
      "created_at",
      "votes",
      "comment_count",
    ];

    if (!validColumnNamesToSortBy.includes(sort_by)) {
      sort_by = "created_at";
    }
    SQLString += ` ORDER BY ${sort_by}`;

    if (order !== "desc" && order !== "asc") {
      order = "desc";
    }
    SQLString += ` ${order}`;
  }

  return db.query(SQLString, dbArgs).then(({ rows }) => {
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
