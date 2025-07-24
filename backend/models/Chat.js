const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  email: String 
});

module.exports = mongoose.model('Chat', ChatSchema);
