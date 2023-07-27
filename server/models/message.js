const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    text: String,
    username: String,
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = { Message };
