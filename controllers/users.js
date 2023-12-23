const bcrypt = require("bcrypt");

const {
  ctrlWrapper,
  HttpError,
  LocaleDate,
  updateTotals,
} = require("../helpers");

const calculateDailyCalories = require("../calculations/calculateDailyCalories");
const calculateDailyNutrition = require("../calculations/calculateDailyNutrition");
const calculateDailyWater = require("../calculations/calculateDailyWater");

const { User } = require("../models/user");
const { Weight } = require("../models/weight");
const { Water } = require("../models/water");
const { Food } = require("../models/food");

const getCurrent = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  const userData = {
    name: user.name,
    age: user.age,
    height: user.height,
    email: user.email,
    gender: user.gender,
    weight: user.weight,
    goal: user.goal,
    activity: user.activity,
    avatarURL: user.avatarURL,
    dailyCalories: user.dailyCalories,
    dailyNutrition: user.dailyNutrition,
    dailyWater: user.dailyWater,
  };
  res.status(200).json({ data: userData });
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
    return res.status(404).json({ message: "User not found" });
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
    res.status(200).json(updatedWeight);
  } else {
    res.status(200).json({ message: "Weight unchanged for specified date" });
  }
};

const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { water } = req.body;

  let { date } = req.body;

  if (!date) {
    date = LocaleDate();
  }

  const existingWater = await Water.findOne({ owner, date }).exec();

  if (!existingWater) {
    const newWater = await Water.create({ owner, water, date });
    res.status(201).json(newWater);
  } else if (existingWater.water !== water) {
    const updatedWater = await Water.findOneAndUpdate(
      { owner, date },
      { water },
      { new: true }
    ).exec();

    if (!updatedWater) {
      throw HttpError(500, "Failed to update water");
    }
    res.status(200).json({ water: updatedWater.water });
  }
};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;
  let { date } = req.body;

  if (!date) {
    date = LocaleDate();
  }

  const existingWater = await Water.findOne({ owner, date }).exec();

  if (!existingWater) {
    res.status(200).json({ message: `No water intake for ${date} found` });
  } else {
    await Water.deleteMany({ owner, date });
    res.status(200).json({ message: `All water intake for ${date} deleted` });
  }
};

const addFood = async (req, res) => {
  const { breakfast, lunch, dinner, snack } = req.body;
  const { _id: owner } = req.user;

  const formattedDate = LocaleDate();

  let existingFood = await Food.findOne({
    owner,
    date: formattedDate,
  }).exec();

  if (existingFood) {
    if (!existingFood.breakfast) {
      existingFood.breakfast = { meals: [] };
    }
    if (!existingFood.lunch) {
      existingFood.lunch = { meals: [] };
    }
    if (!existingFood.dinner) {
      existingFood.dinner = { meals: [] };
    }
    if (!existingFood.snack) {
      existingFood.snack = { meals: [] };
    }

    if (breakfast) {
      existingFood.breakfast.meals.push(...breakfast.meals);
    }
    if (lunch) {
      existingFood.lunch.meals.push(...lunch.meals);
    }
    if (dinner) {
      existingFood.dinner.meals.push(...dinner.meals);
    }
    if (snack) {
      existingFood.snack.meals.push(...snack.meals);
    }

    await existingFood.save();

    await updateTotals(existingFood);

    existingFood = await Food.findOne({
      owner,
      date: formattedDate,
    }).exec();
    res.status(200).json({
      message: "Meals added to existing food intake",
      data: existingFood,
    });
  } else {
    const newFood = await Food.create({
      owner,
      date: formattedDate,
      breakfast: breakfast || { meals: [] },
      lunch: lunch || { meals: [] },
      dinner: dinner || { meals: [] },
      snack: snack || { meals: [] },
    });

    await newFood.save();
    await updateTotals(newFood);

    const createdFood = await Food.findOne({
      owner,
      date: formattedDate,
    }).exec();

    res
      .status(201)
      .json({ message: "New food intake created", data: createdFood });
  }
};

const updateFood = async (req, res) => {
  const { mealId } = req.params;
  const { updatedMeal } = req.body;
  const { _id: owner } = req.user;

  if (!mealId) {
    return res.status(400).json({
      error: "No mealId specified for update",
    });
  }

  const formattedDate = LocaleDate();

  // Assuming the mealId can be part of any section (breakfast, lunch, dinner, snack)
  const sections = ["breakfast", "lunch", "dinner", "snack"];

  let targetType = null;
  let updatedIntake = null;

  // Iterate through each section to find and update the meal
  for (const section of sections) {
    const query = {
      date: formattedDate,
      owner,
      [`${section}.meals.mealId`]: mealId,
    };
    const updateOperation = {
      $set: {
        [`${section}.meals.$`]: updatedMeal,
      },
    };

    updatedIntake = await Food.findOneAndUpdate(query, updateOperation, {
      new: true,
    });

    // If the meal was found and updated, set targetType and break out of the loop
    if (updatedIntake) {
      targetType = section;
      await updateTotals(updatedIntake);
      break;
    }
  }

  if (!targetType) {
    return res.status(404).json({
      error: "Meal not found in any section",
    });
  }

  return res.status(200).json({
    message: `Meal updated in ${targetType}`,
    data: updatedIntake,
  });
};

const deleteFood = async (req, res) => {
  const { mealId } = req.params;
  const { _id: owner } = req.user;

  if (!mealId) {
    return res.status(400).json({
      error: "No mealId specified for deletion",
    });
  }

  const formattedDate = LocaleDate();

  // Assuming the mealId can be part of any section (breakfast, lunch, dinner, snack)
  const sections = ["breakfast", "lunch", "dinner", "snack"];

  let targetType = null;
  let updatedIntake = null;

  // Iterate through each section to find and delete the meal
  for (const section of sections) {
    const query = { date: formattedDate, owner };
    const updateOperation = {
      $pull: {
        [`${section}.meals`]: { mealId },
      },
    };

    const existingFood = await Food.findOne(query).exec();

    updatedIntake = await Food.findOneAndUpdate(query, updateOperation, {
      new: true,
    });

    // If the meal was found and deleted, set targetType and break out of the loop
    if (
      updatedIntake &&
      updatedIntake[section].meals.length < existingFood[section].meals.length
    ) {
      targetType = section;
      await updateTotals(updatedIntake);
      break;
    }
  }

  if (!targetType) {
    return res.status(404).json({
      error: "Meal not found in any section",
    });
  }

  return res.status(200).json({
    message: `Meal deleted from ${targetType}`,
    data: updatedIntake,
  });
};

const resetMeals = async (req, res) => {
  const { mealType } = req.params; // Access mealType directly from req.params
  const { _id: owner } = req.user;

  // Validate mealType
  const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
  if (!validMealTypes.includes(mealType)) {
    return res.status(400).json({
      error: "Invalid mealType specified",
    });
  }

  const formattedDate = LocaleDate();

  // Define the update operation to reset the meal intake
  const resetOperation = {
    $set: {
      [`${mealType}.meals`]: [],
      [`${mealType}.totalCalories`]: 0,
      [`${mealType}.totalFat`]: 0,
      [`${mealType}.totalCarbonohidretes`]: 0,
      [`${mealType}.totalProtein`]: 0,
    },
  };

  // Create the query to find the document to update
  const query = { date: formattedDate, owner };

  // Perform the update operation
  const updatedIntake = await Food.findOneAndUpdate(query, resetOperation, {
    new: true,
  });

  if (!updatedIntake) {
    return res.status(404).json({
      error: "Food intake not found for the specified date",
    });
  }

  await updateTotals(updatedIntake);

  return res.status(200).json({
    message: `${mealType} intake reset to default values`,
    data: updatedIntake,
  });
};

const getCurrentData = async (req, res) => {
  const { _id: owner } = req.user;

  const formattedDate = LocaleDate();

  const existingFood = await Food.findOne({
    owner,
    date: formattedDate,
  }).exec();

  const existingWater = await Water.findOne({
    owner,
    date: formattedDate,
  }).exec();

  const data = {
    food: existingFood,
    water: existingWater.water,
  };

  res.status(200).json({ data });
};

module.exports = {
  getCurrent: ctrlWrapper(getCurrent),
  updateInfo: ctrlWrapper(updateInfo),
  updateGoal: ctrlWrapper(updateGoal),
  updateWeight: ctrlWrapper(updateWeight),
  addWater: ctrlWrapper(addWater),
  deleteWater: ctrlWrapper(deleteWater),
  updateAvatar: ctrlWrapper(updateAvatar),
  addFood: ctrlWrapper(addFood),
  updateFood: ctrlWrapper(updateFood),
  deleteFood: ctrlWrapper(deleteFood),
  getCurrentData: ctrlWrapper(getCurrentData),
  resetMeals: ctrlWrapper(resetMeals),
};
