const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/water");

const { authenticate, validateBody } = require("../../middlewares");

const { schemas } = require("../../models/water");

router.post(
  "/water-intake",
  authenticate,
  validateBody(schemas.joiWaterSchema),
  ctrl.addWater
);

router.delete("/water-intake", authenticate, ctrl.deleteWater);

module.exports = router;
