const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "User",
      required: [true, "Set name for user"],
    },

    email: {
      type: String,
      match: emailRegex,
      unique: true,
      required: [true, "Email is required"],
    },

    password: {
      type: String,
      minlength: 8,
      required: [true, "Set password for user"],
    },

    token: {
      type: String,
      default: "",
    },

    avatarURL: {
      type: String,
    },

    age: {
      type: Number,
      min: 8,
      max: 120,
      required: [true, "Set age for user"],
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Set gender for user"],
    },

    weight: {
      kg: {
        type: Number,
        min: 4,
        max: 300,
        required: [true, "Set weight for user"],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },

    height: {
      type: Number,
      min: 120,
      max: 220,
      required: [true, "Set height for user"],
    },

    activity: {
      type: Number,
      enum: [1.2, 1.375, 1.55, 1.725, 1.9],
      required: [true, "Set activity for user"],
    },

    goal: {
      type: String,
      enum: ["lose fat", "maintain", "gain muscle"],
    },

    dailyCalories: {
      type: Number,
    },

    dailyWater: {
      type: Number,
    },

    dailyNutrition: {
      carbohydrates: Number,
      protein: Number,
      fat: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
  age: Joi.number().min(8).max(120).required(),
  gender: Joi.string().valid("male", "female").required(),
  weight: Joi.object({
    kg: Joi.number().required().min(4).max(300),
    createdAt: Joi.date(),
  }),
  height: Joi.number().min(120).max(220).required(),
  goal: Joi.string().valid("lose fat", "maintain", "gain muscle").required(),
  activity: Joi.number().valid(1.2, 1.375, 1.55, 1.725, 1.9).required(),
  dailyCalories: Joi.number(),
  dailyWater: Joi.number(),
  dailyNutrition: Joi.object({
    carbohydrates: Joi.number(),
    protein: Joi.number(),
    fat: Joi.number(),
  }),
  token: Joi.string(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
