const db = require("./db/connection");

function checkArticleID(id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Article ID not found" });
      return;
    });
}

function checkUsername(usernameToCheck) {
  return db
    .query("SELECT * FROM users WHERE username = $1", [usernameToCheck])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "Username not found" });
      return;
    });
}
module.exports = { checkArticleID, checkUsername };
