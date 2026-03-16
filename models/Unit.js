const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  sortName: { type: String, required: true },
});

module.exports = mongoose.model("Unit", unitSchema);
