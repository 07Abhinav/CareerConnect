// backend/utils/jsearch.js
const axios = require('axios');

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY; // Add your JSearch API key to .env
const JSEARCH_BASE_URL = 'https://jsearch.p.rapidapi.com';

/**
 * Fetch job listings from JSearch API
 * @param {string} query - Job search query (e.g., "JavaScript Developer")
 * @returns {Object[]} - Array of job listings
 */
const fetchJobsFromJSearch = async (skills) => {
    try {
        const jobListings = [];

        // Fetch jobs for each skill individually
        for (const skill of skills) {
            console.log('Fetching jobs for skill:', skill); // Log the skill
            const response = await axios.get(`${JSEARCH_BASE_URL}/search`, {
                params: {
                    query: skill,
                    page: '1',
                    num_pages: '1',
                },
                headers: {
                    'X-RapidAPI-Key': JSEARCH_API_KEY,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                },
            });
            console.log('JSearch API response for', skill, ':', response.data); // Log the API response
            jobListings.push(...response.data.data);
        }

        // Remove duplicate jobs
        const uniqueJobs = Array.from(new Set(jobListings.map(job => job.job_id)))
            .map(id => jobListings.find(job => job.job_id === id));

        return uniqueJobs;
    } catch (error) {
        console.error('Error fetching jobs from JSearch:', error.message);
        return [];
    }
};
module.exports = { fetchJobsFromJSearch };