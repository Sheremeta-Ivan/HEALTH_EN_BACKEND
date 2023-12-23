const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/users");
const {
  authenticate,
  validateBody,
  updateAvatar,
} = require("../../middlewares");

const { schemas } = require("../../models/user");

router.get("/current", authenticate, ctrl.getCurrent);

router.put("/update", authenticate, ctrl.updateInfo);

router.put(
  "/update-avatar",
  authenticate,
  updateAvatar.single("avatarURL"),
  ctrl.updateAvatar
);

router.put(
  "/goal",
  authenticate,
  validateBody(schemas.validateGoal),
  ctrl.updateGoal
);

router.put("/weight", authenticate, ctrl.updateWeight);

router.post("/water-intake", authenticate, ctrl.addWater);

router.delete("/water-intake", authenticate, ctrl.deleteWater);

router.post("/food-intake", authenticate, ctrl.addFood);

router.put("/food-intake/:mealId", authenticate, ctrl.updateFood);

router.delete("/food-intake", authenticate, ctrl.deleteFood);

router.get("/current-data", authenticate, ctrl.getCurrentData);

module.exports = router;
