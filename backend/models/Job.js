const mongoose = require('mongoose');

// Define a schema for recommended jobs
const recommendedJobSchema = new mongoose.Schema({
  job_title: { type: String, required: true },
  job_description: { type: String, required: true },
  similarityScore: { type: Number, required: true },
  // Add other fields as needed
});

// Define the main Job schema
const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: { type: [String], required: true },
  recommendedJobs: { type: [recommendedJobSchema], required: true },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Add an index for efficient querying
jobSchema.index({ userId: 1, skills: 1 });

// Validate that recommendedJobs is not empty
jobSchema.path('recommendedJobs').validate(function (value) {
  return value.length > 0;
}, 'At least one recommended job is required.');

module.exports = mongoose.model('Job', jobSchema);