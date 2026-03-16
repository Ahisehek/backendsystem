const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  siteName: String,
  itemName: String,
  itemGroup: String,
  gst: String,
  hsnCode: String,
  partsNo: String,
  unit: String,
  createdAt: { type: Date, default: Date.now },
 status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Item", itemSchema);
