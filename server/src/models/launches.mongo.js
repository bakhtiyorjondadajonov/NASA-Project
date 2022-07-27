const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  mission: {
    type: String,
  },
  rocket: {
    type: String,
  },
  lounchDate: {
    type: Date,
  },
  target: {
    type: String,
  },
  upcoming: {
    type: Boolean,
    default: true,
  },
  success: {
    type: Boolean,
    default: true,
  },
  flightNumber: {
    type: Number,
    requierd: [true, "you must provide a flight number"],
  },
  customers: {
    type: [String],
  },
});

const Launch = mongoose.model("Launch", launchesSchema);

module.exports = Launch;
