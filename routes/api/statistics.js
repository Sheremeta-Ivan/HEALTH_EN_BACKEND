const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/statistics");

const { authenticate } = require("../../middlewares");

router.get("/:month", authenticate, ctrl.getStatistics);

module.exports = router;
