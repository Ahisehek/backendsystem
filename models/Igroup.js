const mongoose = require('mongoose');

const igroupSchema = new mongoose.Schema({
    name: { type: String,unique: true,}

 
});

module.exports = mongoose.model('Igroup', igroupSchema);