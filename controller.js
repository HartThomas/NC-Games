const {
  selectCategories,
  selectReviews,
  selectReviewByReviewId,
  selectCommentByReviewId,
  insertCommentOnReview,
  updateVotes,
  selectUsers,
  deleteCommentByCommentId,
  readFileEndPoints,
} = require("./model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  const category = req.query.category;
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
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

exports.patchVotes = (req, res, next) => {
  const id = req.params.review_id;
  const body = req.body;
  updateVotes(id, body)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  deleteCommentByCommentId(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  readFileEndPoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
