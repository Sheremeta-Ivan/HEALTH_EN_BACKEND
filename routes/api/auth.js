const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

router.post("/signup", validateBody(schemas.registerSchema), ctrl.register);

router.post("/signin", validateBody(schemas.loginSchema), ctrl.login);

router.post(
  "/forgot-password",
  validateBody(schemas.userResetPasswordSchema),
  ctrl.forgotPassword
);

router.post("/signout", authenticate, ctrl.logout);

module.exports = router;
