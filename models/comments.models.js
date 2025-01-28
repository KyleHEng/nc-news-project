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

function insertCommentByArticleId(name, body, id){
  
  return db.query(`
    INSERT INTO comments
      (author, body, article_id)
    VALUES
      ($1, $2, $3)
    RETURNING *
    `,[name, body, id])
  .then(({rows}) => {
    
    return rows[0];
  })
}
module.exports = { selectCommentsByArticleID, insertCommentByArticleId };
