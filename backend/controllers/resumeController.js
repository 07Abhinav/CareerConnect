const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');

// GCP Configuration
const storage = new Storage();
const BUCKET_NAME = process.env.GCP_BUCKET_NAME;

// Upload Resume to GCP
const uploadResume = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);

    try {
        // Upload file to GCP bucket
        await storage.bucket(BUCKET_NAME).upload(filePath, {
            destination: fileName,
            resumable: false,
            metadata: {
                contentType: req.file.mimetype,
            }
        });

        // Remove the local temporary file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: 'Resume uploaded successfully',
            fileName: fileName
        });

    } catch (error) {
        console.error('Error uploading resume:', error);
        res.status(500).json({ message: 'Failed to upload resume' });
    }
};

module.exports = { uploadResume };
