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

    console.log('User ID:', userId);
    console.log('Skills:', skills);

    // Fetch job listings from JSearch API
    const jobListings = await fetchJobsFromJSearch(skills);
    console.log('Job Listings:', jobListings);

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

    console.log('Recommended Jobs:', recommendedJobs);

    // Save or update recommended jobs and skills to MongoDB
    const jobData = await Job.findOneAndUpdate(
      { userId },
      { skills, recommendedJobs },
      { upsert: true, new: true }
    );

    console.log('Job data saved/updated successfully:', jobData);

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

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is missing. Please authenticate and try again.",
      });
    }

    // Find the recommended jobs for the authenticated user
    const jobData = await Job.findOne({ userId });

    // Check if jobData exists and has recommendedJobs
    if (!jobData) {
      return res.status(404).json({
        success: false,
        message: "No job data found for this user. Please generate recommendations first.",
      });
    }

    if (!jobData.recommendedJobs || jobData.recommendedJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No recommended jobs found. Please upload a resume and generate recommendations.",
      });
    }

    // Return the recommended jobs
    res.status(200).json({
      success: true,
      recommendedJobs: jobData.recommendedJobs,
    });
  } catch (error) {
    console.error("❌ Error fetching recommended jobs:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching recommended jobs.",
      error: error.message, // Include the error message for debugging
    });
  }
};
  
module.exports = { recommendJobs, getRecommendedJobs };