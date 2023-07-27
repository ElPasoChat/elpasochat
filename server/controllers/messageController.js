const { Message } = require('../models/message');

// Controller function for fetching messages
async function getMessages(req, res) {
  try {
    const messages = await Message.find();
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getMessages };
