const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");
const LocaleDate = require("../helpers/LocaleDate");
const Joi = require("joi");

const waterSchema = new Schema(
  {
    date: {
      type: String,
      default: () => LocaleDate(),
    },
    water: {
      type: Number,
      min: 0,
      max: 10000,
      default: 0,
      require: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

waterSchema.post("save", handleMongooseError);

const joiWaterSchema = Joi.object({
  date: Joi.string(),
  water: Joi.number().min(0).max(10000).required().messages({
    "number.min": "Water intake must be at least 0 ml.",
    "number.max": "Water intake must be at most 10000 ml.",
    "any.required": "Water intake is required.",
  }),
  owner: Joi.string(),
});

const Water = model("water", waterSchema);

const schemas = {
  joiWaterSchema,
};

module.exports = { Water, schemas };
