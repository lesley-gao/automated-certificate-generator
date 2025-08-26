const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: path.join(__dirname, '../../uploads/') });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

router.get('/download/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../uploads/', req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
});

module.exports = router;
