const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const uuid = require("uuid");
const calculateDailyCalories = require("../calculations/calculateDailyCalories");
const calculateDailyNutrition = require("../calculations/calculateDailyNutrition");
const calculateDailyWater = require("../calculations/calculateDailyWater");
const { sendEmail } = require("../helpers");

const { User } = require("../models/user");
const { Weight } = require("../models/weight");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();

  if (user) {
    throw HttpError(409, "Email already in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const dailyCaloriesCalc = calculateDailyCalories({
    age: newUser.age,
    weight: newUser.weight,
    height: newUser.height,
    gender: newUser.gender,
    activity: newUser.activity,
  });
  const dailyNutritionCalc = calculateDailyNutrition({
    goal: newUser.goal,
    dailyCalories: dailyCaloriesCalc,
  });
  const dailyWaterCalc = calculateDailyWater({
    weight: newUser.weight,
    activity: newUser.activity,
  });

  const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "23h" });

  const data = await User.findByIdAndUpdate(
    newUser._id,
    {
      $set: {
        token: token,
        dailyCalories: dailyCaloriesCalc,
        dailyNutrition: dailyNutritionCalc,
        dailyWater: dailyWaterCalc,
      },
    },
    {
      new: true,
    }
  );

  await Weight.create({
    weight: newUser.weight,
    owner: newUser._id,
  });

  res.status(201).json({
    token: data.token,
    data: {
      name: data.name,
      email: data.email,
      gender: data.gender,
      weight: data.weight,
      goal: data.goal,
      avatarURL: data.avatarURL,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();

  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const data = await User.findByIdAndUpdate(
    user._id,
    { token },
    {
      new: true,
    }
  );

  res.status(201).json({
    token: data.token,
    data: {
      name: data.name,
      email: data.email,
      gender: data.gender,
      weight: data.weight,
      goal: data.goal,
      avatarURL: data.avatarURL,
    },
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  const temporaryPassword = uuid.v4().slice(0, 10);
  const hashPassword = await bcrypt.hash(temporaryPassword, 10);
  await User.findByIdAndUpdate(
    user._id,
    { password: hashPassword },
    {
      new: true,
    }
  );
  const mail = {
    to: email,
    subject: "HealthyHub",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HealthyHub</title>
</head>
<body>
  <header>
    <h1>Password recovery for HealthyHub Apps</h1>
  </header>
  <main>
    <p>Your new password is:</p>
    <b>${temporaryPassword}</b>
    <p>
      Please change your password as soon as possible.
      <br>
      Your new password is valid for 24 hours.
    </p>
  </main>
</body>
</html>
`,
  };
  await sendEmail(mail);
  res.status(200).json({
    message: "Check your email",
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const getCurrent = async (req, res) => {
  const data = req.user;

  res.status(200).json({
    token: data.token,
    data: {
      name: data.name,
      email: data.email,
      gender: data.gender,
      age: data.age,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      activity: data.activity,
      avatarURL: data.avatarURL,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  forgotPassword: ctrlWrapper(forgotPassword),
};
