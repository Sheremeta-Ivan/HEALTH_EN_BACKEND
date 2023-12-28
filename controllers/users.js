const bcrypt = require("bcrypt");

const { ctrlWrapper, HttpError, LocaleDate } = require("../helpers");

const calculateDailyCalories = require("../calculations/calculateDailyCalories");
const calculateDailyNutrition = require("../calculations/calculateDailyNutrition");
const calculateDailyWater = require("../calculations/calculateDailyWater");

const { User } = require("../models/user");
const { Weight } = require("../models/weight");

const getCurrent = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(404, "User not found");
  }
  res.status(200).json({ data: user });
};

const updateInfo = async (req, res) => {
  const { _id: owner } = req.user;
  const user = await User.findById(owner);
  const { weight, newPassword } = req.body;
  let { date } = req.body;

  if (!date) {
    date = LocaleDate();
  }

  if (!user) {
    throw HttpError(404, "User not found");
  }

  const updatedData = req.body;

  for (const key in updatedData) {
    user[key] = updatedData[key];
  }

  if (
    updatedData.age ||
    updatedData.weight ||
    updatedData.height ||
    updatedData.gender ||
    updatedData.activity
  ) {
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
  }

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
  }

  await user.save();

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

    return res.status(200).json({ data: user });
  }
  return res.status(200).json({ data: user });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const avatarURL = req.file.path;

  const updatedUser = await User.findOneAndUpdate(
    { _id },
    { avatarURL },
    { new: true }
  );

  res.json({ avatarURL: updatedUser.avatarURL });
};

const updateGoal = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw HttpError(404, "User not found");
  }

  const newGoal = req.body.goal;

  user.goal = newGoal;

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

  user.dailyCalories = dailyCaloriesCalc;
  user.dailyNutrition = dailyNutritionCalc;

  await user.save();

  return res.status(200).json({ data: user });
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateInfo: ctrlWrapper(updateInfo),
  updateGoal: ctrlWrapper(updateGoal),
  updateAvatar: ctrlWrapper(updateAvatar),
};
