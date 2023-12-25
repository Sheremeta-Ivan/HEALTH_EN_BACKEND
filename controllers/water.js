const { HttpError, LocaleDate, ctrlWrapper } = require("../helpers");

const { Water } = require("../models/water");

const addWater = async (req, res) => {
  const { _id: owner } = req.user;
  const { water } = req.body;

  let { date } = req.body;

  if (!date) {
    date = LocaleDate();
  }

  const existingWater = await Water.findOne({ owner, date }).exec();

  if (!existingWater) {
    const newWater = await Water.create({ owner, water, date });
    res.status(201).json(newWater);
  } else if (existingWater.water !== water) {
    const updatedWater = await Water.findOneAndUpdate(
      { owner, date },
      { water },
      { new: true }
    ).exec();

    if (!updatedWater) {
      throw HttpError(500, "Failed to update water");
    }
    res.status(200).json({ water: updatedWater.water });
  }
};

const deleteWater = async (req, res) => {
  const { _id: owner } = req.user;
  let { date } = req.body;

  if (!date) {
    date = LocaleDate();
  }

  const existingWater = await Water.findOne({ owner, date }).exec();

  if (!existingWater) {
    res.status(200).json({ message: `No water intake for ${date} found` });
  } else {
    await Water.deleteMany({ owner, date });
    res.status(200).json({ message: `All water intake for ${date} deleted` });
  }
};

module.exports = {
  addWater: ctrlWrapper(addWater),
  deleteWater: ctrlWrapper(deleteWater),
};
