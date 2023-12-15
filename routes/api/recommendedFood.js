const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/recommendedFoods");
const { authenticate } = require("../../middlewares");

router.get("/recommended-food", authenticate, ctrl.listRecommendedFood);

module.exports = router;
