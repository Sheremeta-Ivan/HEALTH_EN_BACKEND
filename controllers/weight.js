const { ctrlWrapper, HttpError, LocaleDate } = require("../helpers");

const calculateDailyCalories = require("../calculations/calculateDailyCalories");
const calculateDailyNutrition = require("../calculations/calculateDailyNutrition");
const calculateDailyWater = require("../calculations/calculateDailyWater");

const { User } = require("../models/user");
const { Weight } = require("../models/weight");

const updateWeight = async (req, res) => {
  const { _id: owner } = req.user;
  const { weight } = req.body;

  let { date } = req.body;

  if (!date) {
    date = LocaleDate();
  }

  const existingWeight = await Weight.findOne({ owner, date }).exec();

  if (!existingWeight) {
    const newWeight = await Weight.create({ owner, weight, date });
    res.status(201).json(newWeight);
  } else if (existingWeight.weight !== weight) {
    const updatedWeight = await Weight.findOneAndUpdate(
      { owner, date },
      { weight },
      { new: true }
    ).exec();

    if (!updatedWeight) {
      throw HttpError(500, "Failed to update weight");
    }

    const user = await User.findByIdAndUpdate(
      owner,
      { weight },
      { new: true }
    ).exec();

    if (!user) {
      throw HttpError(404, "That user does not exists");
    }

    const dailyCaloriesCalc = calculateDailyCalories({
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activity: user.activity,
    });
    const dailyNutritionCalc = calculateDailyNutrition({
      goal: user.goal,
      dailyCalories: dailyCaloriesCalc,
    });
    const dailyWaterCalc = calculateDailyWater({
      weight: user.weight,
      activity: user.activity,
    });

    user.dailyCalories = dailyCaloriesCalc;
    user.dailyNutrition = dailyNutritionCalc;
    user.dailyWater = dailyWaterCalc;

    await user.save();
    return res.status(200).json({ data: user });
  } else {
    res.status(200).json({ message: "Weight unchanged for specified date" });
  }
};

module.exports = { updateWeight: ctrlWrapper(updateWeight) };
