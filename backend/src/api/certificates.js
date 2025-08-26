const express = require('express');
const router = express.Router();


const generator = require('../utils/certificateGenerator');
router.post('/generate', async (req, res) => {
  // Call stub generator
  const result = await generator.generate(req.body);
  res.json(result);
});


// Stub: Batch download
router.get('/batch-download', (req, res) => {
  // Return a stub download link
  res.json({ success: true, downloadUrl: '/api/certificates/download/batch.zip' });
});

module.exports = router;
