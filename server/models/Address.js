const mongoose = require('mongoose');

const addessSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: String, required: true }
});

module.exports = mongoose.model('Address', addessSchema);