const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  profile: Object,
  stats: Object,
  scores: {
    activity: Number,
    quality: Number,
    diversity: Number,
    community: Number,
    hiring: Number,
    total: Number
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours TTL index
  }
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
module.exports = Report;
