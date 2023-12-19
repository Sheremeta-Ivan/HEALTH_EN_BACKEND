const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const LocaleDate = require("../helpers/LocaleDate");
const Joi = require("joi");

const foodSchema = new Schema(
  {
    diary: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    name: {
      type: String,
      required: [true, "Meal name is required"],
    },
    carbohydrate: {
      type: Number,
      default: 0,
      required: [true, "Carbohydrate is required"],
    },
    protein: {
      type: Number,
      default: 0,
      required: [true, "Protein is required"],
    },
    fat: {
      type: Number,
      default: 0,
      required: [true, "Fat is required"],
    },
    total: {
      type: Number,
      default: function () {
        return this.fat + this.protein + this.carbohydrate;
      },
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    date: {
      type: String,
      require: true,
      default: () => LocaleDate(),
    },
  },

  { versionKey: false, timestamps: true }
);

const joiFoodSchema = Joi.object({
  diary: Joi.string().valid("Breakfast", "Lunch", "Dinner", "Snack"),
  name: Joi.string().required(),
  carbohydrate: Joi.number().required(),
  protein: Joi.number().required(),
  fat: Joi.number().required(),
  total: Joi.number().required(),
  owner: Joi.string().required(),
  date: Joi.string().required(),
});

const schemas = {
  joiFoodSchema,
};

foodSchema.post("save", handleMongooseError);

const Food = model("food", foodSchema);

module.exports = { Food, schemas };
