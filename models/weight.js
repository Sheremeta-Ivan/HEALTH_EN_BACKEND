const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
const LocaleDate = require("../helpers/LocaleDate");

const weightSchema = new Schema(
  {
    date: {
      type: String,
      default: () => LocaleDate(),
    },
    weight: {
      type: Number,
      min: 4,
      max: 300,
      required: [true, "Set weight for user"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const joiWeightSchema = Joi.object({
  date: Joi.string(),
  weight: Joi.number().min(4).max(300).required().messages({
    "number.min": "Weight must be at least 4 kg.",
    "number.max": "Weight must be at most 300 kg.",
    "any.required": "Weight is required.",
  }),
  owner: Joi.string(),
});

const schemas = { joiWeightSchema };

weightSchema.post("save", handleMongooseError);

const Weight = model("weights", weightSchema);

module.exports = { Weight, schemas };
