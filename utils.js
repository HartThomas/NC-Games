const db = require("./db");

exports.checkIfReviewExists = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  } else {
    return db.query("SELECT * FROM reviews").then((data) => {
      const count = 0;
      const filteredArray = data.rows.filter((review) => {
        return review.review_id === +id;
      });
      if (filteredArray.length > 0) {
        return true;
      } else return false;
    });
  }
};

exports.checkIfCommentExists = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  } else {
    return db.query("SELECT * FROM comments").then((data) => {
      const filteredArray = data.rows.filter((comment) => {
        return comment.comment_id === +id;
      });
      if (filteredArray.length > 0) {
        return true;
      } else return false;
    });
  }
};
