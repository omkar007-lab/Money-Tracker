// /api/models/transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  datetime: { type: Date, required: true },
});

module.exports = mongoose.model('Transaction', transactionSchema);
