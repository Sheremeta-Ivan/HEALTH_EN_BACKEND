const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

const { User } = require("../models/user");

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
  const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: "23h" });

  const data = await User.findByIdAndUpdate(
    newUser._id,
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
      age: data.age,
      height: data.height,
      weight: data.weight,
      goal: data.goal,
      activity: data.activity,
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

  res.json({
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
};
