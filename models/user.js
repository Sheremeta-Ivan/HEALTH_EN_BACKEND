const { Schema, model } = require("mongoose");

const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const LocaleDate = require("../helpers/LocaleDate");
const { GENDERS, ACTIVITIES, GOALS, EMAIL } = require("../constants/userEnum");

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
      match: EMAIL,
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
      enum: GENDERS,
      required: [true, "Set gender for user"],
    },

    weight: {
      type: Number,
      min: 4,
      max: 300,
      required: [true, "Set weight for user"],
    },

    height: {
      type: Number,
      min: 120,
      max: 220,
      required: [true, "Set height for user"],
    },

    activity: {
      type: Number,
      enum: ACTIVITIES,
      required: [true, "Set activity for user"],
    },

    goal: {
      type: String,
      enum: GOALS,
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
    date: {
      type: String,
      default: () => LocaleDate(),
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name must be at most 30 characters long.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().pattern(EMAIL).required().messages({
    "string.pattern.base": "Invalid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
  age: Joi.number().min(8).max(120).required().messages({
    "number.min": "Age must be at least 8.",
    "number.max": "Age must be at most 120.",
    "any.required": "Age is required.",
  }),
  gender: Joi.string().valid("male", "female").required().messages({
    "string.valid": "Gender must be either 'male' or 'female'.",
    "any.required": "Gender is required.",
  }),
  weight: Joi.number().min(4).max(300).required().messages({
    "number.min": "Weight must be at least 4.",
    "number.max": "Weight must be at most 300.",
    "any.required": "Weight is required.",
  }),
  height: Joi.number().min(120).max(220).required().messages({
    "number.min": "Height must be at least 120.",
    "number.max": "Height must be at most 220.",
    "any.required": "Height is required.",
  }),
  goal: Joi.string()
    .valid("lose fat", "maintain", "gain muscle")
    .required()
    .messages({
      "string.valid":
        "Goal must be one of 'lose fat', 'maintain', or 'gain muscle'.",
      "any.required": "Goal is required.",
    }),
  activity: Joi.number()
    .valid(1.2, 1.375, 1.55, 1.725, 1.9)
    .required()
    .messages({
      "number.valid": "Activity level must be 1.2, 1.375, 1.55, 1.725, or 1.9.",
      "any.required": "Activity level is required.",
    }),
  dailyCalories: Joi.number(),
  dailyWater: Joi.number(),
  dailyNutrition: Joi.object({
    carbohydrates: Joi.number(),
    protein: Joi.number(),
    fat: Joi.number(),
  }),
  token: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL).required().messages({
    "string.pattern.base": "Invalid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
  }),
});

const userResetPasswordSchema = Joi.object({
  email: Joi.string().pattern(EMAIL).required().messages({
    "string.pattern.base": "Invalid email address.",
    "any.required": "Email is required.",
  }),
});

const validateGoal = Joi.object({
  goal: Joi.string()
    .valid("lose fat", "maintain", "gain muscle")
    .required()
    .messages({
      "string.valid":
        "Goal must be one of 'lose fat', 'maintain', or 'gain muscle'.",
      "any.required": "Goal is required.",
    }),
});

const validateUpdateInfo = Joi.object({
  name: Joi.string().min(2).max(30).optional().messages({
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name must be at most 30 characters long.",
  }),
  email: Joi.string().pattern(EMAIL).optional().messages({
    "string.pattern.base": "Invalid email address.",
  }),
  newPassword: Joi.string().min(8).optional().messages({
    "string.min": "Password must be at least 8 characters long.",
  }),
  age: Joi.number().min(8).max(120).optional().messages({
    "number.min": "Age must be at least 8.",
    "number.max": "Age must be at most 120.",
  }),
  gender: Joi.string().valid("male", "female").optional().messages({
    "string.valid": "Gender must be either 'male' or 'female'.",
  }),
  weight: Joi.number().min(4).max(300).optional().messages({
    "number.min": "Weight must be at least 4.",
    "number.max": "Weight must be at most 300.",
  }),
  height: Joi.number().min(120).max(220).optional().messages({
    "number.min": "Height must be at least 120.",
    "number.max": "Height must be at most 220.",
  }),
  activity: Joi.number()
    .valid(1.2, 1.375, 1.55, 1.725, 1.9)
    .optional()
    .messages({
      "number.valid": "Activity level must be 1.2, 1.375, 1.55, 1.725, or 1.9.",
    }),
});


const schemas = {
  registerSchema,
  loginSchema,
  userResetPasswordSchema,
  validateGoal,
  validateUpdateInfo,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
