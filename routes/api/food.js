const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/food");

const { authenticate, validateBody } = require("../../middlewares");

const { schemas } = require("../../models/food");

router.post(
  "/food-intake",
  authenticate,
  validateBody(schemas.joiFoodSchema),
  ctrl.addFood
);

// router.put(
//   "/food-intake/:mealId",
//   validateBody(schemas.joiUpdateFoodSchema),
//   authenticate,
//   ctrl.updateFood
// );

router.delete("/reset-meals/:mealType", authenticate, ctrl.resetMeals);
router.delete("/food-intake/:mealId", authenticate, ctrl.deleteFood);

router.get("/current-data", authenticate, ctrl.getCurrentData);

module.exports = router;
