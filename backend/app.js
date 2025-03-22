const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Routes
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const jobRoutes = require('./routes/jobs');

// Load environment variables
dotenv.config();  // Load environment variables from .env file
console.log('Bucket Name:', process.env.GCP_BUCKET_NAME);  // Log to confirm env variable is loaded

// Initialize Express app
const app = express();

// Set up multer storage (stores files in the "uploads/" folder temporarily)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create the uploads directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
    },
});

const upload = multer({ storage });

// Use multer middleware for form-data file uploads
app.use(upload.single('resume'));

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));  
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Routes
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api/resume', resumeRoutes);   // Resume upload routes
app.use('/api/jobs', jobRoutes);        // Job recommendation routes

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB database'))
    .catch(err => console.error('MongoDB connection error:', err));

// Export the app for use in server.js
module.exports = app;