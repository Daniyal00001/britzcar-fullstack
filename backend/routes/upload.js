// ============================================
// FILE 2: backend/routes/upload.js
// ============================================
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Upload multiple images
router.post('/', upload.array('images', 6), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Return the file paths (relative to public directory)
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);
    
    res.status(200).json({
      message: 'Files uploaded successfully',
      filePaths: filePaths,
      count: filePaths.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// Handle upload errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Max 5MB per file.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 6 images allowed.' });
    }
  }
  res.status(500).json({ message: error.message });
});

module.exports = router;