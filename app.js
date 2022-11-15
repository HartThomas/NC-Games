const express = require("express");
const {
  getCategories,
  getReviews,
  getReviewByReviewId,
} = require("./controller");

const app = express();

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByReviewId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID" });
  } else res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
