//messageRoutes.js

const express = require('express');
const router = express.Router();
const { Message } = require('../models/message');

// Get all messages
router.get('/', async (req, res, next) => {
  try {
    const messages = await Message.find();
    res.json({ messages });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
