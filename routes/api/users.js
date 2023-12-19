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

router.post("/water", authenticate, ctrl.addWater);

router.delete("/water", authenticate, ctrl.deleteWater);

module.exports = router;
