const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewByReviewId,
  getCommentsByReviewId,
  postCommentOnReview,
  patchVotes,
  getUsers,
  deleteComment,
  getEndpoints,
} = require("./controller");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByReviewId);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/users", getUsers);
app.get("/api", getEndpoints);

app.post("/api/reviews/:review_id/comments", postCommentOnReview);

app.patch("/api/reviews/:review_id", patchVotes);

app.delete("/api/comment/:comment_id", deleteComment);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input type" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Failing schema validation" });
  }
});

module.exports = app;
