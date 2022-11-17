const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewByReviewId,
  getCommentsByReviewId,
  postCommentOnReview,
} = require("./controller");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByReviewId);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", postCommentOnReview);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Failing schema validation" });
  }
});

module.exports = app;
