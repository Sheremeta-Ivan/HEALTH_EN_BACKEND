const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/weight");

const { authenticate, validateBody } = require("../../middlewares");

const { schemas } = require("../../models/weight");

router.put(
  "/weight",
  authenticate,
  validateBody(schemas.joiWeightSchema),
  ctrl.updateWeight
);

module.exports = router;
