const { selectCategories } = require("./model");

exports.getCategories = (req, res, next) => {
  selectCategories().then((categories) => {
    console.log(categories);
    res.status(200).send({ categories });
  });
};
