const { ctrlWrapper, LocaleDate, updateTotals } = require("../helpers");

const { Water } = require("../models/water");
const { Food } = require("../models/food");

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

  const updatedMeal = {
    mealId, 
    name: req.body.name,
    calories: req.body.calories,
    fat: req.body.fat,
    carbohydrates: req.body.carbohydrates,
    protein: req.body.protein,
  };

  const { _id: owner } = req.user;

  if (!mealId) {
    return res.status(400).json({
      error: "No mealId specified for update",
    });
  }

  const formattedDate = LocaleDate();

  const sections = ["breakfast", "lunch", "dinner", "snack"];

  let targetType = null;
  let updatedIntake = null;

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

  const sections = ["breakfast", "lunch", "dinner", "snack"];

  let targetType = null;
  let updatedIntake = null;

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
  const { mealType } = req.params;
  const { _id: owner } = req.user;

  const validMealTypes = ["breakfast", "lunch", "dinner", "snack"];
  if (!validMealTypes.includes(mealType)) {
    return res.status(400).json({
      error: "Invalid mealType specified",
    });
  }

  const formattedDate = LocaleDate();

  const resetOperation = {
    $set: {
      [`${mealType}.meals`]: [],
      [`${mealType}.totalCalories`]: 0,
      [`${mealType}.totalFat`]: 0,
      [`${mealType}.totalCarbohydrates`]: 0,
      [`${mealType}.totalProtein`]: 0,
    },
  };

  const query = { date: formattedDate, owner };

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
  addFood: ctrlWrapper(addFood),
  updateFood: ctrlWrapper(updateFood),
  deleteFood: ctrlWrapper(deleteFood),
  resetMeals: ctrlWrapper(resetMeals),
  getCurrentData: ctrlWrapper(getCurrentData),
};
