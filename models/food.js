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
        mealId: Joi.string().required().messages({
          "any.required": "Meal ID is required.",
        }),
        name: Joi.string().required().messages({
          "any.required": "Meal name is required.",
        }),
        calories: Joi.number().required().messages({
          "any.required": "Calories are required.",
        }),
        fat: Joi.number().required().messages({
          "any.required": "Fat content is required.",
        }),
        carbohydrates: Joi.number().required().messages({
          "any.required": "Carbohydrate content is required.",
        }),
        protein: Joi.number().required().messages({
          "any.required": "Protein content is required.",
        }),
      })
    ),
  }).optional(),
  lunch: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required().messages({
          "any.required": "Meal ID is required.",
        }),
        name: Joi.string().required().messages({
          "any.required": "Meal name is required.",
        }),
        calories: Joi.number().required().messages({
          "any.required": "Calories are required.",
        }),
        fat: Joi.number().required().messages({
          "any.required": "Fat content is required.",
        }),
        carbohydrates: Joi.number().required().messages({
          "any.required": "Carbohydrate content is required.",
        }),
        protein: Joi.number().required().messages({
          "any.required": "Protein content is required.",
        }),
      })
    ),
  }).optional(),
  dinner: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required().messages({
          "any.required": "Meal ID is required.",
        }),
        name: Joi.string().required().messages({
          "any.required": "Meal name is required.",
        }),
        calories: Joi.number().required().messages({
          "any.required": "Calories are required.",
        }),
        fat: Joi.number().required().messages({
          "any.required": "Fat content is required.",
        }),
        carbohydrates: Joi.number().required().messages({
          "any.required": "Carbohydrate content is required.",
        }),
        protein: Joi.number().required().messages({
          "any.required": "Protein content is required.",
        }),
      })
    ),
  }).optional(),
  snack: Joi.object({
    meals: Joi.array().items(
      Joi.object({
        mealId: Joi.string().required().messages({
          "any.required": "Meal ID is required.",
        }),
        name: Joi.string().required().messages({
          "any.required": "Meal name is required.",
        }),
        calories: Joi.number().required().messages({
          "any.required": "Calories are required.",
        }),
        fat: Joi.number().required().messages({
          "any.required": "Fat content is required.",
        }),
        carbohydrates: Joi.number().required().messages({
          "any.required": "Carbohydrate content is required.",
        }),
        protein: Joi.number().required().messages({
          "any.required": "Protein content is required.",
        }),
      })
    ),
  }).optional(),
});

const joiUpdateFoodSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Name cannot be empty.",
  }),
  calories: Joi.number().min(0).messages({
    "number.min": "Calories must be greater than or equal to 0.",
  }),
  fat: Joi.number().min(0).messages({
    "number.min": "Fat content must be greater than or equal to 0.",
  }),
  carbohydrates: Joi.number().min(0).messages({
    "number.min": "Carbohydrate content must be greater than or equal to 0.",
  }),
  protein: Joi.number().min(0).messages({
    "number.min": "Protein content must be greater than or equal to 0.",
  }),
});

const schemas = { joiFoodSchema, joiUpdateFoodSchema };

FoodIntakeSchema.post("save", handleMongooseError);

const Food = model("food", FoodIntakeSchema);

module.exports = {
  schemas,
  Food,
};
