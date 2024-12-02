// /api/controllers/transactionController.js
const Transaction = require('../models/transactionModel');
const MainAmount = require('../models/mainAmountModel');

// Add a new transaction
const addTransaction = async (req, res) => {
  const { name, description, amount, datetime } = req.body;
  try {
    const newTransaction = new Transaction({ name, description, amount, datetime });
    await newTransaction.save();

    // Update the main balance
    const mainAmount = await MainAmount.findOne();
    const updatedAmount = mainAmount.amount + amount;
    await MainAmount.updateOne({}, { amount: updatedAmount });

    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
};

// Get transactions with pagination
const getTransactions = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const transactions = await Transaction.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const totalCount = await Transaction.countDocuments();
    res.json({ transactions, totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(id);

    // Update the main balance
    const mainAmount = await MainAmount.findOne();
    const updatedAmount = mainAmount.amount - transaction.amount;
    await MainAmount.updateOne({}, { amount: updatedAmount });

    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};

module.exports = { addTransaction, getTransactions, deleteTransaction };
