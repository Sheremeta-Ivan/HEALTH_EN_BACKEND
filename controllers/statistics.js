const { Water } = require("../models/water");
const { Weight } = require("../models/weight");
const { Food } = require("../models/food");

const { ctrlWrapper } = require("../helpers");

const getStatistics = async (req, res) => {
  const { month } = req.params;
  const { _id: owner } = req.user;

  const monthNameToNumber = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const monthNumber = monthNameToNumber[month];

  if (!monthNumber) {
    return res.status(400).json({
      error: `Invalid month specified`,
    });
  }

  const monthStr = String(monthNumber).padStart(2, "0");

  const userWaterIntakes = await Water.aggregate([
    {
      $match: {
        date: { $regex: `^\\d{2}.${monthStr}.\\d{4}$` },
        owner,
      },
    },
    {
      $group: {
        _id: "$owner",
        totalWater: {
          $push: {
            date: "$date",
            water: "$water",
          },
        },
      },
    },
  ]);

  let totalWater = [];

  if (userWaterIntakes.length > 0) {
    totalWater = userWaterIntakes[0].totalWater;
  }

  const userWeightEntries = await Weight.aggregate([
    {
      $match: {
        date: { $regex: `^\\d{2}.${monthStr}.\\d{4}$` },
        owner,
      },
    },
    {
      $group: {
        _id: "$owner",
        totalWeight: {
          $push: {
            date: "$date",
            weight: "$weight",
          },
        },
      },
    },
  ]);

  let totalWeight = [];

  if (userWeightEntries.length > 0) {
    totalWeight = userWeightEntries[0].totalWeight;
  }

  const userFoodIntakes = await Food.aggregate([
    {
      $match: {
        date: { $regex: `^\\d{2}.${monthStr}.\\d{4}$` },
        owner,
      },
    },
    {
      $group: {
        _id: "$owner",
        totalCalories: {
          $push: {
            date: "$date",
            calories: "$totalCalories",
          },
        },
      },
    },
  ]);

  let totalCalories = [];

  if (userFoodIntakes.length > 0) {
    totalCalories = userFoodIntakes[0].totalCalories;
  }

  const totalDaysInMonth = new Date(
    new Date().getFullYear(),
    monthStr,
    0
  ).getDate();

  const daysInMonth = Array.from(
    { length: totalDaysInMonth },
    (_, index) => index + 1
  );

  totalWater = daysInMonth.map((day) => {
    const existingWaterData = totalWater.find(
      (data) => parseInt(data.date.split(".")[0]) === day
    );
    return (
      existingWaterData || {
        date: day,
        water: 0,
      }
    );
  });

  totalWater = totalWater.map((entry) => ({
    date: parseInt(entry.date),
    water: entry.water,
  }));

  totalWeight = daysInMonth.map((day) => {
    const existingWeightData = totalWeight.find(
      (data) => parseInt(data.date.split(".")[0]) === day
    );
    return (
      existingWeightData || {
        date: day,
        weight: 0,
      }
    );
  });

  totalWeight = totalWeight.map((entry) => ({
    date: parseInt(entry.date),
    weight: entry.weight,
  }));

  totalCalories = daysInMonth.map((day) => {
    const existingCaloriesData = totalCalories.find(
      (data) => parseInt(data.date.split(".")[0]) === day
    );
    return (
      existingCaloriesData || {
        date: day,
        calories: 0,
      }
    );
  });

  totalCalories = totalCalories.map((entry) => ({
    date: parseInt(entry.date),
    calories: entry.calories,
  }));

  return res.status(200).json({
    data: {
      water: totalWater,
      weight: totalWeight,
      calories: totalCalories,
    },
  });
};

module.exports = {
  getStatistics: ctrlWrapper(getStatistics),
};
