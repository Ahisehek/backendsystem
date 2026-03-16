
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  siteName: String,
  employeeName: String,
  contactNo: String,
  concernType: String,
  description: String,
  attachment: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports= mongoose.model("Ticket", ticketSchema);