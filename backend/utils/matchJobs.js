const axios = require('axios');
const natural = require('natural');

// Function to fetch jobs from JSearch API
const fetchJobsFromJSearch = async (query) => {
    const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;  // Add your API key in .env
    const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=1&num_pages=1`;

    const options = {
        headers: {
            'X-RapidAPI-Key': JSEARCH_API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.get(url, options);
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
};

// Function to match skills with jobs using Cosine Similarity
const matchJobs = (resumeSkills, jobListings) => {
    const tfidf = new natural.TfIdf();
    
    // Add resume skills as a document
    tfidf.addDocument(resumeSkills.join(' '));

    // Add job descriptions as documents
    jobListings.forEach(job => tfidf.addDocument(job.description));

    // Calculate similarity scores
    const scores = jobListings.map((job, index) => {
        const similarity = natural.JaroWinklerDistance(resumeSkills.join(' '), job.description);
        return { job, score: similarity };
    });

    // Sort by highest similarity score
    scores.sort((a, b) => b.score - a.score);

    // Return the top 5 matches
    return scores.slice(0, 5).map(result => ({
        title: result.job.job_title,
        company: result.job.employer_name,
        location: result.job.job_city,
        description: result.job.job_description,
        score: result.score.toFixed(2)
    }));
};

module.exports = { fetchJobsFromJSearch, matchJobs };
