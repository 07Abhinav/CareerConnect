const express = require("express");
const authenticate = require("../middleware/authenticate");
const uploadResume = require("../utils/gcpStorage");
const parseResume = require("../utils/parseResume"); // Import the parseResume utility

const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

// Multer middleware for handling `multipart/form-data`
const upload = multer({ storage });

// Apply `authenticate` middleware to verify token before uploading
router.post(
    "/upload",
    authenticate, // <-- Multer handles the file before hitting the controller
    async (req, res) => {
        try {
            console.log("📌 Debug: User ID from Middleware ->", req.userId); // Check user ID

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            // console.log("📂 Uploaded file:", req.file); // Debugging file details

            const file = req.file;

            // Upload file to GCS
            const publicUrl = await uploadResume(file.path);

            // Parse the resume and extract skills
            const skills = await parseResume(file.path);
            console.log("🛠️ Extracted skills:", skills); // Debugging extracted skills

            // Fetch user from DB
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            // Update user with resume URL and skills
            user.resumeUrl = publicUrl;
            user.skills = skills;
            await user.save();

            // Delete the temporary file after upload
            fs.unlinkSync(file.path);

            res.json({
                success: true,
                message: "Resume uploaded",
                url: publicUrl,
                skills: skills,
            });
        } catch (error) {
            console.error("🔥 ERROR in resume upload:", error);
            res.status(500).json({ success: false, message: "Something went wrong" });
        }
    }
);

module.exports = router;
