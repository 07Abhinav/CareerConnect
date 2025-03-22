const express = require("express");
const authenticate = require("../middleware/authenticate");
const { recommendJobs, getRecommendedJobs } = require("../controllers/jobController");

const router = express.Router();

// POST: Generate and recommend jobs
router.post("/recommend", authenticate, recommendJobs);

// GET: Fetch recommended jobs from MongoDB
router.get("/recommended", authenticate, getRecommendedJobs);

module.exports = router;
