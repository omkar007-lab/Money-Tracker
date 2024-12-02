// /api/routes/transactions.js
const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

// Placeholder route for transactions
router.get('/', getTransactions);

// Route for adding a new transaction
router.post('/', addTransaction);

// Route for deleting a transaction
router.delete('/:id', deleteTransaction);

module.exports = router;
