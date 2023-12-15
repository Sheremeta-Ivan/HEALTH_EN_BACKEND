const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/users");
const { authenticate, validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.get("/current", authenticate, ctrl.getCurrent);

router.put("/update", authenticate, ctrl.updateInfo);

router.put("/goal", authenticate, validateBody(schemas.validateGoal), ctrl.updateGoal);

module.exports = router;
