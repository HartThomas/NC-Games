const db = require("./db");

exports.selectCategories = () => {
  return db.query("SELECT slug, description FROM categories;").then((data) => {
    return data.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      "SELECT users.username AS owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, comment_count FROM users JOIN reviews ON reviews.owner = users.username JOIN (SELECT COUNT(comment_id) AS comment_count, review_id FROM comments GROUP BY review_id) AS count_table ON count_table.review_id = reviews.review_id;"
    )
    .then((data) => {
      return data.rows;
    });
};
