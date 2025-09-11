// models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  spend: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  last_active: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
