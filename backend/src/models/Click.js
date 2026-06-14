const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  urlId: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true },
  timestamp: { type: Date, default: Date.now },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  ip: { type: String, default: '' },
});

module.exports = mongoose.model('Click', clickSchema);