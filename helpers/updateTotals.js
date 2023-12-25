const updateTotals = async (intake) => {
  const types = ["breakfast", "lunch", "dinner", "snack"];

  let totalAllCalories = 0;
  let totalAllFat = 0;
  let totalAllProtein = 0;
  let totalAllCarbs = 0;

  for (const type of types) {
    const meals = intake[type].meals;

    const total = meals.reduce(
      (acc, curr) => {
        acc.totalCalories += curr.calories || 0;
        acc.totalFat += curr.fat || 0;
        acc.totalCarbohydrates += curr.carbohydrates || 0;
        acc.totalProtein += curr.protein || 0;
        return acc;
      },
      {
        totalCalories: 0,
        totalFat: 0,
        totalCarbohydrates: 0,
        totalProtein: 0,
      }
    );

    intake[type].totalCalories = total.totalCalories;
    intake[type].totalFat = total.totalFat;
    intake[type].totalCarbohydrates = total.totalCarbohydrates;
    intake[type].totalProtein = total.totalProtein;

    totalAllCalories += total.totalCalories;
    totalAllFat += total.totalFat;
    totalAllProtein += total.totalProtein;
    totalAllCarbs += total.totalCarbohydrates;
  }

  intake.totalCalories = totalAllCalories;
  intake.totalFat = totalAllFat;
  intake.totalProtein = totalAllProtein;
  intake.totalCarbohydrates = totalAllCarbs;

  await intake.save();
};

module.exports = updateTotals;
