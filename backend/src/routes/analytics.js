const express = require('express');
const Url = require('../models/Url');
const Click = require('../models/Click');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.userId });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    const clicks = await Click.find({ urlId: req.params.id }).sort({ timestamp: -1 }).limit(50);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyClicks = await Click.aggregate([
      { $match: { urlId: url._id, timestamp: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    res.json({
      url: { ...url.toObject(), shortUrl: `${process.env.BASE_URL}/${url.shortCode}` },
      totalClicks: url.clicks,
      lastVisited: clicks[0]?.timestamp || null,
      recentVisits: clicks,
      dailyClicks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;