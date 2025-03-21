const { Storage } = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file
console.log('Bucket Name:', process.env.GCP_BUCKET_NAME);

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILE
});

// Get the bucket
const bucketName = process.env.GCP_BUCKET_NAME;

if (!bucketName) {
    throw new Error('GCP_BUCKET_NAME environment variable is not set');
}
const bucket = storage.bucket(bucketName);

const uploadResume = async (filePath) => {
    try {
        const fileName = path.basename(filePath);
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(fileName);

        await bucket.upload(filePath, {
            destination: file,
            resumable: false,
            metadata: {
                contentType: "application/pdf",
            },
        });

        // Make file public
        await file.makePublic();
        return `https://storage.googleapis.com/${bucketName}/${fileName}`;
    } catch (error) {
        console.error("GCP Upload Error:", error);
        throw new Error("Failed to upload to Google Cloud Storage");
    }
};

module.exports = uploadResume;
