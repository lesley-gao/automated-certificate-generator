const express = require('express');
const cors = require('cors');
require('dotenv').config();


const auth = require('./auth');
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Error handling for payload too large
app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Request payload too large. Please reduce the size of uploaded images or try again.'
    });
  }
  next(error);
});

app.use(auth.isAuthenticated);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


const api = require('./api');
app.use('/api/assets', api.assets);
app.use('/api/certificates', api.certificates);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
