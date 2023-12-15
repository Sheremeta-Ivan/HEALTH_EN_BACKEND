const { ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const calculateDailyCalories = require("../calculations/calculateDailyCalories");
const calculateDailyNutrition = require("../calculations/calculateDailyNutrition");
const calculateDailyWater = require("../calculations/calculateDailyWater");

const getCurrent = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  const userData = {
    name: user.name,
    email: user.email,
    gender: user.gender,
    weight: user.weight,
    goal: user.goal,
    avatarURL: user.avatarURL,
    dailyCalories: user.dailyCalories,
    dailyNutrition: user.dailyNutrition,
    dailyWater: user.dailyWater,
  };
  res.status(200).json({ data: userData });
};

const updateInfo = async (req, res) => {
  const user = await User.findById(req.user._id); // отримує користувача за його ID з токена

  if (!user) {
    return res.status(404).json({ message: "User not found" }); // Повернути помилку, якщо користувача не знайдено
  }

  // Отримайте оновлені дані з запиту
  const updatedData = req.body;

  // Оновіть дані користувача
  for (const key in updatedData) {
    user[key] = updatedData[key];
  }

  // Перерахуйте BMR/денну норму води/співвідношення макроелементів до BMR
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

  // Збережіть оновлені дані
  await user.save();

  // Поверніть оновлені дані
  return res.status(200).json({ data: user });
};

const updateGoal = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
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

const addWeight = async (req, res) => {};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateInfo: ctrlWrapper(updateInfo),
  updateGoal: ctrlWrapper(updateGoal),
  addWeight: ctrlWrapper(addWeight),
};
