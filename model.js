const db = require("./db");
const { checkIfReviewExists } = require("./utils");
const { readFile } = require("fs.promises");

exports.selectCategories = () => {
  return db.query("SELECT slug, description FROM categories;").then((data) => {
    return data.rows;
  });
};

exports.selectReviews = (
  category = "all",
  sort_by = "created_at",
  order = "DESC"
) => {
  const validDirections = ["ASC", "asc", "desc", "DESC"];
  const validColumns = [
    "owner",
    "comment_count",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "votes",
    "designer",
  ];
  const validCategories = [
    "strategy",
    "hidden-roles",
    "dexterity",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
    "all",
  ];
  if (
    !validColumns.includes(sort_by) ||
    !validDirections.includes(order) ||
    !validCategories.includes(category)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  let queryStr =
    "SELECT users.username AS owner, COUNT(comments.review_id)AS comment_count, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer FROM reviews JOIN users ON reviews.owner = users.username LEFT JOIN comments ON comments.review_id = reviews.review_id";

  if (category !== "all") {
    queryStr += ` WHERE category = '${category}'`;
  }

  queryStr += ` GROUP BY reviews.review_id, users.username ORDER BY ${sort_by} ${order.toUpperCase()};`;
  return db.query(queryStr).then((data) => {
    return data.rows;
  });
};

exports.selectReviewByReviewId = (id) => {
  return db
    .query(
      "SELECT users.username, COUNT(comments.review_id)AS comment_count, reviews.review_body, reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer FROM reviews JOIN users ON reviews.owner = users.username LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id, users.username;",
      [id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return data.rows[0];
    });
};

exports.selectCommentByReviewId = (id) => {
  return db
    .query(
      "SELECT users.username AS author, comment_id, votes, created_at, body, review_id FROM comments JOIN users ON users.username = comments.author WHERE comments.review_id = $1 ORDER BY created_at;",
      [id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found" });
      }
      return data.rows;
    });
};

exports.insertCommentOnReview = (id, body) => {
  return checkIfReviewExists(id).then((doesReviewExist) => {
    if (doesReviewExist === false) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    } else {
      if (!body.body || !body.username) {
        return Promise.reject({ status: 400, msg: "Missing required field/s" });
      } else {
        return db
          .query(
            "INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING author AS username, body;",
            [body.username, body.body, id]
          )
          .then((data) => {
            return data.rows[0];
          });
      }
    }
  });
};

exports.updateVotes = (id, body) => {
  return checkIfReviewExists(id).then((doesReviewExist) => {
    if (doesReviewExist === false) {
      return Promise.reject({ status: 404, msg: "Review not found" });
    } else {
      if (!body.inc_votes) {
        return Promise.reject({ status: 400, msg: "Missing required field/s" });
      } else {
        return db
          .query(
            "UPDATE reviews SET votes = $1 + votes WHERE review_id = $2 RETURNING *",
            [body.inc_votes, id]
          )
          .then((data) => {
            return data.rows[0];
          });
      }
    }
  });
};

exports.selectUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then((data) => {
      return data.rows;
    });
};

exports.deleteCommentByCommentId = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "Invalid id" });
  } else {
    return db
      .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [id])
      .then((data) => {
        if (data.rowCount < 1) {
          return Promise.reject({ status: 404, msg: "Comment not found" });
        } else return;
      });
  }
};

exports.readFileEndPoints = () => {
  return readFile("./endpoints.json", "utf8").then((data) => {
    return JSON.stringify(data);
  });
};
