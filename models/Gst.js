const mongoose = require("mongoose");

const gstSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Gst", gstSchema);
