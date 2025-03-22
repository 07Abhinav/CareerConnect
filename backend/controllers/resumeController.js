const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
const parseResume = require("../utils/parseResume");
const Resume = require("../models/Resume");
const User = require("../models/User");

// GCP Configuration
const storage = new Storage();
const BUCKET_NAME = process.env.GCP_BUCKET_NAME;

/**
 * Upload Resume to GCP and Store Skills in MongoDB
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadResume = async (req, res) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "No resume file or path found" });
    }

    console.log("📄 Processing resume:", req.file.originalname);
    const filePath = req.file.path;

    try {
        // Generate a unique file name for GCP
        const fileName = `${Date.now()}_${path.basename(filePath)}`;

        // Upload file to GCP bucket
        await storage.bucket(BUCKET_NAME).upload(filePath, {
            destination: fileName,
            resumable: false,
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`;
        console.log("✅ Resume uploaded to GCP:", publicUrl);

        // Parse the resume and extract skills
        const skills = await parseResume(filePath);
        console.log("🛠️ Extracted skills:", skills);

        // Save the resume and skills to MongoDB
        const resume = new Resume({
            userId: req.userId, // Corrected to use userId from middleware
            resumeUrl: publicUrl,
            skills: skills,
        });

        await resume.save();

        // Update user with resume URL and skills
        await User.findByIdAndUpdate(req.userId, {
            resumeUrl: publicUrl,
            skills: skills,
        });

        console.log("📚 Resume saved to MongoDB:", resume);

        // Remove the local temporary file after processing
        fs.unlinkSync(filePath);
        console.log("🗑️ Temporary file deleted:", filePath);

        // Return success response
        res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            url: publicUrl,
            skills: skills,
        });
    } catch (error) {
        console.error("🔥 Error uploading resume:", error);

        // Attempt to delete the temporary file in case of an error
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log("🗑️ Temporary file deleted after error:", filePath);
            } catch (unlinkError) {
                console.error("❌ Error deleting temporary file:", unlinkError);
            }
        }

        res.status(500).json({ success: false, message: "Failed to upload resume" });
    }
};

module.exports = { uploadResume };
