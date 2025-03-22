const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const parseResume = require('../utils/parseResume');
const Resume = require('../models/Resume');

// GCP Configuration
const storage = new Storage();
const BUCKET_NAME = process.env.GCP_BUCKET_NAME;
// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
console.log('Uploads directory:', uploadsDir);
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload Resume to GCP and Store Skills in MongoDB
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadResume = async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'No resume file uploaded' });
    }

    console.log('Uploading resume:', req.file);

    // Generate a unique file name and define the file path
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);

    // Log the file path and check if the file exists
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));

    try {
        // Upload file to GCP bucket
        await storage.bucket(BUCKET_NAME).upload(filePath, {
            destination: fileName,
            resumable: false,
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        console.log('Resume uploaded to GCP:', fileName);

        // Parse the resume and extract skills
        const skills = await parseResume(filePath);
        console.log('Extracted skills:', skills);

        // Save the resume and skills to MongoDB
        const resume = new Resume({
            userId: req.user.id, // Assuming you have user authentication
            filePath: `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`,
            skills: skills,
        });
        await resume.save();

        console.log('Resume saved to MongoDB:', resume);

        // Remove the local temporary file after processing
        fs.unlinkSync(filePath);
        console.log('Temporary file deleted:', filePath);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            url: `https://storage.googleapis.com/${BUCKET_NAME}/${fileName}`,
            skills: skills,
        });
    } catch (error) {
        console.error('Error uploading resume:', error);

        // Attempt to delete the temporary file in case of an error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Temporary file deleted after error:', filePath);
        }

        // Return error response
        res.status(500).json({ success: false, message: 'Failed to upload resume' });
    }
};

module.exports = { uploadResume };