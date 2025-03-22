const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: { type: [String], required: true },
  recommendedJobs: { type: [Object], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Add an index for efficient querying
jobSchema.index({ userId: 1, skills: 1 });

module.exports = mongoose.model('Job', jobSchema);
