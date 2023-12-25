const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
require("dotenv").config();
const {
  authRouter,
  recommendedFoodRouter,
  userRouter,
  statisticsRouter,
  foodRouter,
  waterRouter,
  weightRouter,
} = require("./routes/api");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", recommendedFoodRouter);

app.use("/api/auth", authRouter);

app.use("/api/user", userRouter);

app.use("/api/user", waterRouter);

app.use("/api/user", statisticsRouter);

app.use("/api/user", foodRouter);

app.use("/api/user", weightRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found :(" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
