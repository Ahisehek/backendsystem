const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  sortName: { type: String, required: true },
});

module.exports = mongoose.model("Site", siteSchema);
