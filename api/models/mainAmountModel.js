const mongoose = require('mongoose');

const mainAmountSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MainAmount', mainAmountSchema);
