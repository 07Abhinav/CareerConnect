const express = require('express');
const router = express.Router();
const { recommendJobs } = require('../controllers/jobController');

// POST route to recommend jobs
router.post('/recommend', recommendJobs);

module.exports = router;
