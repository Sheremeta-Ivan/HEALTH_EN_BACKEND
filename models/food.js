const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const LocaleDate = require("../helpers/LocaleDate");
// const Joi = require("joi");

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
      carbonohidretes: {
        type: Number,
        require: [true, "carbonohidretes is required"],
      },
      protein: {
        type: Number,
        require: [true, "carbonohidretes is required"],
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

  totalCarbonohidretes: {
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

    totalCarbonohidretes: {
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

FoodIntakeSchema.post("save", handleMongooseError);

const Food = model("food", FoodIntakeSchema);

module.exports = {
  Food,
};
