const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const recommendedFood = new Schema({
  name: String,
  amount: String,
  img: String,
  calories: Number,
  nutrition: {
    carbohydrates: Number,
    protein: Number,
    fat: Number,
  },
});

recommendedFood.post("save", handleMongooseError);

const addRecommendedFood = Joi.object({
  name: Joi.string(),
  amount: Joi.string(),
  img: Joi.string(),
  calories: Joi.number(),
  nutrition: {
    carbohydrates: Joi.number(),
    protein: Joi.number(),
    fat: Joi.number(),
  },
});

const schemas = {
  addRecommendedFood,
};

const RecommendedFood = model("recommendedFoods", recommendedFood);

module.exports = {
  RecommendedFood,
  schemas,
};
