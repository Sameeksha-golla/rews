const multer = require('multer');

// Use memory storage to store files in memory as Buffer objects
// This allows us to save the file directly to MongoDB
const storage = multer.memoryStorage();

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  // Accept images, pdfs, and common document formats
  const allowedFileTypes = [
    'image/jpeg', 'image/png', 'image/gif', 
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Please upload an image, PDF, or document file.'), false);
  }
};

// Create multer upload instance
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

module.exports = upload;
