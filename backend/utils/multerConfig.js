const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temporary folder for storing files
  },
  filename: (req, file, cb) => {
    // Replace spaces with underscores and append timestamp to make filename unique
    const sanitizedFileName = file.originalname.replace(/\s+/g, '_'); // Replace spaces
    cb(null, `${Date.now()}_${sanitizedFileName}`);
  },
});

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = upload;
