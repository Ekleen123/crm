const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },  // e.g. "Summer Discount"
    audienceFilter: { type: Object, required: true },       // Example: { spend: { $gt: 5000 }, visits: { $lt: 3 } }   
  message: { type: String, required: true },        // e.g. "Come back and get 20% off"

}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);