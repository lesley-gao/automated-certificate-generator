const express = require('express');
const router = express.Router();
const generator = require('../utils/certificateGenerator');

// Generate individual certificate
router.post('/generate', async (req, res) => {
  try {
    const result = await generator.generate(req.body);
    res.json(result);
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate and download ZIP file with all certificates
router.post('/generate-zip', async (req, res) => {
  try {
    const { recipients, designSettings, backgroundImage } = req.body;
    
    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No recipients provided' 
      });
    }

    console.log(`🚀 Generating ZIP with ${recipients.length} certificates...`);
    
    const result = await generator.generateZip({
      recipients,
      designSettings,
      backgroundImage
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${result.fileName}"`);
    res.setHeader('Content-Length', result.zipBuffer.length);

    console.log(`✅ ZIP generated successfully: ${result.fileName}`);
    res.send(result.zipBuffer);
  } catch (error) {
    console.error('ZIP generation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Legacy endpoint for backward compatibility
router.get('/batch-download', (req, res) => {
  res.json({ 
    success: false, 
    error: 'This endpoint is deprecated. Use POST /api/certificates/generate-zip instead.' 
  });
});

module.exports = router;
