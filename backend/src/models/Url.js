const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: String, default: null },
  clicks: { type: Number, default: 0 },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);