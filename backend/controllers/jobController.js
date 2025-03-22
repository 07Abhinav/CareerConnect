// backend/controllers/jobController.js
const { fetchJobsFromJSearch } = require('../utils/jsearch');

/**
 * Recommend jobs based on extracted skills
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recommendJobs = async (req, res) => {
    try {
        const { skills } = req.body; // Extracted skills from the resume

        // Fetch job listings from JSearch API
        const jobListings = await fetchJobsFromJSearch(skills);

        // Match jobs based on extracted skills
        const recommendedJobs = jobListings.map(job => {
            const jobText = `${job.job_title} ${job.job_description}`.toLowerCase();
            const commonSkills = skills.filter(skill => jobText.includes(skill.toLowerCase()));
            const similarityScore = commonSkills.length / skills.length;
            return {
                ...job,
                similarityScore,
            };
        }).filter(job => job.similarityScore > 0) // Filter out jobs with no matching skills
          .sort((a, b) => b.similarityScore - a.similarityScore); // Sort by similarity score

        res.status(200).json({ success: true, recommendedJobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { recommendJobs };