const express = require("express");
const authenticate = require("../middleware/authenticate"); // Ensure this is correct
const uploadResume = require("../utils/gcpStorage");
const User = require("../models/User");

const router = express.Router();

// Apply `authenticate` middleware to verify token before uploading
router.post("/upload", authenticate, async (req, res) => {
    try {
        // console.log("📌 Debug: User ID from Middleware ->", req.userId); // Check user ID

        if (!req.file) {  // Note: `req.file` instead of `req.files`
            return res.status(400).json({ message: "No file uploaded" });
        }

        // console.log("📂 Uploaded file:", req.file); // Debugging file details

        const file = req.file;

        // Upload file to GCS
        const publicUrl = await uploadResume(file.path);

        // Fetch user from DB
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.resumeUrl = publicUrl;
        await user.save();

        res.json({ success: true, message: "Resume uploaded", url: publicUrl });
    } catch (error) {
        console.error("🔥 ERROR in resume upload:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

module.exports = router;
