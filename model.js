const db = require("./db");

exports.selectCategories = () => {
  return db.query("SELECT slug, description FROM categories;").then((data) => {
    return data.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      "SELECT users.username AS owner, COUNT(comments.review_id)AS comment_count, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer FROM reviews JOIN users ON reviews.owner = users.username LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id, users.username ORDER BY created_at DESC;"
    )
    .then((data) => {
      return data.rows;
    });
};

exports.selectReviewByReviewId = (id) => {
  return db
    .query(
      "SELECT users.username AS owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, review_body FROM reviews JOIN users ON reviews.owner = users.username WHERE review_id = $1;",
      [id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return data.rows[0];
    });
};
