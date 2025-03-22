const Job = require('../models/Job');
const { fetchJobsFromJSearch } = require('../utils/jsearch');

/**
 * Recommend jobs based on extracted skills
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recommendJobs = async (req, res) => {
  try {
    const { skills } = req.body; // Extracted skills from the resume
    const userId = req.userId;

    // Fetch job listings from JSearch API
    const jobListings = await fetchJobsFromJSearch(skills);

    // Match jobs based on extracted skills
    const recommendedJobs = jobListings
      .map((job) => {
        const jobText = `${job.job_title} ${job.job_description}`.toLowerCase();
        const commonSkills = skills.filter((skill) =>
          jobText.includes(skill.toLowerCase())
        );
        const similarityScore = commonSkills.length / skills.length;
        return {
          ...job,
          similarityScore,
        };
      })
      .filter((job) => job.similarityScore > 0) // Filter out jobs with no matching skills
      .sort((a, b) => b.similarityScore - a.similarityScore); // Sort by similarity score

    // Save recommended jobs and skills to MongoDB
    const jobData = new Job({
      userId,
      skills,
      recommendedJobs,
    });

    await jobData.save();

    res.status(200).json({
      success: true,
      recommendedJobs,
    });
  } catch (error) {
    console.error('Error recommending jobs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get recommended jobs from MongoDB
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRecommendedJobs = async (req, res) => {
    try {
      const userId = req.userId; // Extract userId from authenticated request
  
      // Find the recommended jobs for the authenticated user
      const jobData = await Job.findOne({ userId });
  
      if (!jobData || !jobData.recommendedJobs || jobData.recommendedJobs.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No recommended jobs found. Please upload a resume and generate recommendations.",
        });
      }
  
      res.status(200).json({
        success: true,
        recommendedJobs: jobData.recommendedJobs,
      });
    } catch (error) {
      console.error("❌ Error fetching recommended jobs:", error);
      res.status(500).json({ success: false, message: "Error fetching recommended jobs" });
    }
  };
  
module.exports = { recommendJobs, getRecommendedJobs };