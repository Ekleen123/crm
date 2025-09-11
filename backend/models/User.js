// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed password for local users (null for google users)
  provider: { type: String, default: 'local' }, // 'local' | 'google' | 'guest'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
