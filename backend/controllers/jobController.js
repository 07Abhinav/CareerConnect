const axios = require('axios');
const { extractTextFromPDF, extractSkills } = require('../utils/extractSkills');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

const storage = new Storage();
const BUCKET_NAME = process.env.GCP_BUCKET_NAME;
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

// Fetch jobs from JSearch API
const fetchJobsFromAPI = async (skills) => {
    const query = skills.join(' ');  // Combine skills into a query string

    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: query,
            page: '1',
            num_pages: '1'
        },
        headers: {
            'X-RapidAPI-Key': JSEARCH_API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data.data;  // Array of job listings
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

// Controller to recommend jobs based on resume skills
const recommendJobs = async (req, res) => {
    const { fileName } = req.body;  // Get resume filename from request

    if (!fileName) {
        return res.status(400).json({ message: 'File name is required' });
    }

    const destinationPath = path.join(__dirname, `../uploads/${fileName}`);

    try {
        // Download the resume from GCP
        const file = storage.bucket(BUCKET_NAME).file(fileName);
        await file.download({ destination: destinationPath });

        // Extract text and skills from the resume
        const resumeText = await extractTextFromPDF(destinationPath);
        const skills = extractSkills(resumeText);

        console.log('📌 Extracted Skills:', skills);

        // Fetch matching jobs
        const jobs = await fetchJobsFromAPI(skills);

        // Clean up: Remove the downloaded file
        fs.unlinkSync(destinationPath);

        res.status(200).json({
            message: 'Job recommendations fetched successfully',
            skills: skills,
            jobs: jobs
        });

    } catch (error) {
        console.error('Error recommending jobs:', error);
        res.status(500).json({ message: 'Failed to recommend jobs' });
    }
};

module.exports = { recommendJobs };
