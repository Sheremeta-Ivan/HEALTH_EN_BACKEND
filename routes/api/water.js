const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/water");

const { authenticate, validateBody } = require("../../middlewares");

const { schemas } = require("../../models/water");

router.post(
  "",
  authenticate,
  validateBody(schemas.joiWaterSchema),
  ctrl.addWater
);

router.delete("", authenticate, ctrl.deleteWater);

module.exports = router;
