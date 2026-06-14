const express = require('express');
const Url = require('../models/Url');
const router = express.Router();

router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).json({ message: 'Short URL not found' });

    res.json({
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      totalClicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt,
      isExpired: url.expiresAt ? new Date() > url.expiresAt : false,
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;