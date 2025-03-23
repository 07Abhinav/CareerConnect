const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); // Load environment variables from .env file

// ✅ Check if GCP_KEY_JSON is set in .env
if (!process.env.GCP_KEY_JSON) {
  throw new Error("❌ GCP_KEY_JSON environment variable is not set.");
}
// console.log("GCP_KEY_JSON:", process.env.GCP_KEY_JSON);
// 📂 Define a temporary path for the key file
const tempKeyFilePath = "/a.json";

// ✨ Write the JSON content from GCP_KEY_JSON to the temporary file
fs.writeFileSync(tempKeyFilePath, process.env.GCP_KEY_JSON);

// 🎯 Initialize Google Cloud Storage with the temporary key file
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: tempKeyFilePath, // Use the temp key file
});

// 🔥 Get the bucket name from .env
const bucketName = process.env.GCP_BUCKET_NAME;

if (!bucketName) {
  throw new Error("❌ GCP_BUCKET_NAME environment variable is not set.");
}

// 🎯 Get the GCP bucket
const bucket = storage.bucket(bucketName);

// 📤 Upload Resume to GCP Bucket
const uploadResume = async (filePath) => {
  try {
    const fileName = path.basename(filePath);
    const file = bucket.file(fileName);

    // Upload the file to the GCP bucket
    await bucket.upload(filePath, {
      destination: file,
      resumable: false,
      metadata: {
        contentType: "application/pdf",
      },
    });

    // ✅ Make the file public
    await file.makePublic();
    console.log(`✅ Resume uploaded to: https://storage.googleapis.com/${bucketName}/${fileName}`);

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  } catch (error) {
    console.error("🔥 GCP Upload Error:", error);
    throw new Error("❌ Failed to upload to Google Cloud Storage");
  }
};

module.exports = uploadResume;
