const {
  BASE_WATER_REQUIREMENT_COEFFICIENT,
  MINIMAL_ACTIVITY_COEFFICIENT,
  LIGHT_ACTIVITY_COEFFICIENT,
  AVERAGE_ACTIVITY_COEFFICIENT,
  HIGH_ACTIVITY_COEFFICIENT,
  VERY_HIGH_ACTIVITY_COEFFICIENT,
} = require("../constants/waterConstants");

const calculateDailyWater = (userData) => {
  const { weight, activity } = userData;
  let ACTIVITY_COEFFICIENT;

  switch (activity) {
    case 1.2:
      ACTIVITY_COEFFICIENT = MINIMAL_ACTIVITY_COEFFICIENT;
      break;
    case 1.375:
      ACTIVITY_COEFFICIENT = LIGHT_ACTIVITY_COEFFICIENT;
      break;
    case 1.55:
      ACTIVITY_COEFFICIENT = AVERAGE_ACTIVITY_COEFFICIENT;
      break;
    case 1.725:
      ACTIVITY_COEFFICIENT = HIGH_ACTIVITY_COEFFICIENT;
      break;
    case 1.9:
      ACTIVITY_COEFFICIENT = VERY_HIGH_ACTIVITY_COEFFICIENT;
      break;
    default:
      throw new Error("Invalid coefficient of activity");
  }

  return (
    weight * BASE_WATER_REQUIREMENT_COEFFICIENT * ACTIVITY_COEFFICIENT * 1000
  );
};

module.exports = calculateDailyWater;
