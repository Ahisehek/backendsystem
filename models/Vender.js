const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  gstCertificate: String,
  panCard: String,
  cancelledCheque: String,
  msme: String,
});

const venderSchema = new mongoose.Schema({
  siteName: String,
  accountName: String,
  fullAddress: String,
  city: String,
  contactPersonName: String,
  contactPersonNo: String,
  emailId: String,
  bankName: String,
  bankAccountNo: String,
  ifscCode: String,
  panNo: String,
  gstNo: String,
  msmeNo: String,
   accountGroup: String,
  gstState: String,
  tds: String,

  msmeType: String,
 
  attachments: attachmentSchema,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, );


const Vender = mongoose.models.Vender || mongoose.model("Vender", venderSchema);

module.exports = Vender;