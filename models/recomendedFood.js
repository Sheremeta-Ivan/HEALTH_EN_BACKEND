const { Schema, model } = require("mongoose");
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



const RecommendedFood = model("recommendedFoods", recommendedFood);

module.exports = {
  RecommendedFood,
};
