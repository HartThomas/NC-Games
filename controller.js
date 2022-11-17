const {
  selectCategories,
  selectReviews,
  selectReviewByReviewId,
  selectCommentByReviewId,
  insertCommentOnReview,
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

exports.getCommentsByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  selectCommentByReviewId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentOnReview = (req, res, next) => {
  const id = req.params.review_id;
  const body = req.body;
  insertCommentOnReview(id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
