const { HttpError, ctrlWrapper } = require("../helpers");
const { RecommendedFood } = require("../models/recomendedFood");

const listRecommendedFood = async (__, res) => {
  const result = await RecommendedFood.find().exec();

  if (!result) {
    HttpError(404, "Not found");
  }

  res.status(200).send(result);
};

module.exports = {
  listRecommendedFood: ctrlWrapper(listRecommendedFood),
};
