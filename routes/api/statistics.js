const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/statistics");

const { authenticate } = require("../../middlewares");

router.get("/statistics/:month", authenticate, ctrl.getStatistics);

module.exports = router;
