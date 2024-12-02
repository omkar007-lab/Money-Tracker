const express = require('express');
const router = express.Router();
const { getMainAmount, updateMainAmount } = require('../controllers/mainAmountController');

// Route to get the main amount balance
router.get('/', getMainAmount);

// Route to update the main amount balance
router.put('/', updateMainAmount);

module.exports = router;
