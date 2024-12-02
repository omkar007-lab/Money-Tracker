//routes/dat.js



const express = require('express');
const router = express.Router();
const { getMainAmount, updateMainAmount } = require('../controllers/mainAmountController');
const { addTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

// Route to get the main amount balance
router.get('/mainAmount', getMainAmount);

// Route to update the main amount balance
router.put('/mainAmount', updateMainAmount);

// Route to get transactions
router.get('/transactions', getTransactions);

// Route for adding a new transaction
router.post('/transactions', addTransaction);

// Route for deleting a transaction
router.delete('/transactions/:id', deleteTransaction);

module.exports = router;
