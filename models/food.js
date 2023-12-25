const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const LocaleDate = require("../helpers/LocaleDate");
const Joi = require("joi");

const oneDaySchema = new Schema({
  meals: [
    {
      mealId: {
        type: String,
        ref: "meal",
        require: [true, "ID is required"],
      },
      name: {
        type: String,
        require: [true, "Name is required"],
      },
      calories: {
        type: Number,
        require: [true, "calories is required"],
      },
      fat: {
        type: Number,
        require: [true, "fat is required"],
      },
      carbohydrates: {
        type: Number,
        require: [true, "carbohydrates is required"],
      },
      protein: {
        type: Number,
        require: [true, "protein is required"],
      },
      _id: false,
    },
  ],

  totalCalories: {
    type: Number,
    default: 0,
  },

  totalFat: {
    type: Number,
    default: 0,
  },

  totalCarbohydrates: {
    type: Number,
    default: 0,
  },

  totalProtein: {
    type: Number,
    default: 0,
  },
});

const FoodIntakeSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      select: false,
    },

    date: {
      type: String,
      default: () => LocaleDate(),
      require: true,
    },

    totalCalories: {
      type: Number,
      default: 0,
    },

    totalFat: {
      type: Number,
      default: 0,
    },

    totalCarbohydrates: {
      type: Number,
      default: 0,
    },

    totalProtein: {
      type: Number,
      default: 0,
    },

    breakfast: {
      type: oneDaySchema,
      default: null,
      _id: true,
    },

    lunch: {
      type: oneDaySchema,
      default: null,
      _id: true,
    },

    dinner: {
      type: oneDaySchema,
      default: null,
      _id: true,
    },

    snack: {
      type: oneDaySchema,
      default: null,
      _id: true,
    },
  },
  { versionKey: false }
);

const joiFoodSchema = Joi.object({
  date: (Joi.string().default = () => LocaleDate()),
  breakfast: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbohydrates: Joi.number().required(),
        protein: Joi.number().required(),
      })
    ),
  }).optional(),
  lunch: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbohydrates: Joi.number().required(),
        protein: Joi.number().required(),
      })
    ),
  }).optional(),
  dinner: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbohydrates: Joi.number().required(),
        protein: Joi.number().required(),
      })
    ),
  }).optional(),
  snack: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required(),
        name: Joi.string().required(),
        calories: Joi.number().required(),
        fat: Joi.number().required(),
        carbohydrates: Joi.number().required(),
        protein: Joi.number().required(),
      })
    ),
  }).optional(),
});

const joiUpdateFoodSchema = Joi.object({
  name: Joi.string(),
  calories: Joi.number(),
  fat: Joi.number().min(0),
  carbohydrates: Joi.number().min(0),
  protein: Joi.number().min(0),
});

const schemas = { joiFoodSchema, joiUpdateFoodSchema };

FoodIntakeSchema.post("save", handleMongooseError);

const Food = model("food", FoodIntakeSchema);

module.exports = {
  schemas,
  Food,
};
