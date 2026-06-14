const express = require('express');
const { body, validationResult } = require('express-validator');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const Click = require('../models/Click');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Create short URL
router.post('/', authMiddleware, [
  body('longUrl').isURL().withMessage('Please enter a valid URL'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { longUrl, customAlias, expiresAt } = req.body;
  try {
    if (customAlias) {
      const exists = await Url.findOne({ shortCode: customAlias });
      if (exists) return res.status(409).json({ message: 'Custom alias already taken' });
    }
    const shortCode = customAlias || nanoid(6);
    const url = await Url.create({
      userId: req.userId, longUrl, shortCode,
      customAlias: customAlias || null,
      expiresAt: expiresAt || null,
    });
    res.status(201).json({ ...url.toObject(), shortUrl: `${process.env.BASE_URL}/${shortCode}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all URLs for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.userId }).sort({ createdAt: -1 });
    const data = urls.map(u => ({
      ...u.toObject(),
      shortUrl: `${process.env.BASE_URL}/${u.shortCode}`
    }));
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete URL
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, userId: req.userId });
    if (!url) return res.status(404).json({ message: 'URL not found' });
    await Url.deleteOne({ _id: req.params.id });
    await Click.deleteMany({ urlId: req.params.id });
    res.json({ message: 'Deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update destination URL
router.put('/:id', authMiddleware, [
  body('longUrl').isURL().withMessage('Valid URL required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const url = await Url.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { longUrl: req.body.longUrl },
      { new: true }
    );
    if (!url) return res.status(404).json({ message: 'URL not found' });
    res.json({ ...url.toObject(), shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;