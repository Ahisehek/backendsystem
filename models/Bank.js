const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    name: { type: String,unique: true,}

 
});

module.exports = mongoose.model('Bank', bankSchema);