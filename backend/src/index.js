require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const useragent = require('express-useragent');
const Url = require('./models/Url');
const Click = require('./models/Click');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(useragent.express());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/urls', require('./routes/urls'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/public', require('./routes/public'));

// SHORT URL REDIRECT — this must be LAST
app.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).json({ message: 'Short URL not found' });

    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ message: 'This link has expired' });
    }

    await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });
    await Click.create({
      urlId: url._id,
      browser: req.useragent.browser,
      os: req.useragent.os,
      ip: req.ip,
    });

    res.redirect(url.longUrl);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));