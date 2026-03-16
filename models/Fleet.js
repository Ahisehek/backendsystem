const mongoose = require('mongoose');

const fleetSchema = new mongoose.Schema({
    name: { type: String,unique: true,}

 
});

module.exports = mongoose.model('Fleet', fleetSchema);