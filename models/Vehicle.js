const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
 
  make: String,
  model: String,
  subContractorName: String,
  registrationNo: String,
  siteName: String,
  machineCategory: String,
  status: { type: String, default: 'pending' },
  assetPics: {
    vehiclePic: String,
    vehicleRcPic: String,
    licencePic: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
