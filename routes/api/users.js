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

router.put(
  "/update",
  authenticate,
  validateBody(schemas.validateUpdateInfo),
  ctrl.updateInfo
);

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

module.exports = router;
