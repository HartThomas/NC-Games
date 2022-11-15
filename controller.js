const {
  selectCategories,
  selectReviews,
  selectReviewByReviewId,
} = require("./model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  selectReviewByReviewId(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
