const MainAmount = require('../models/mainAmountModel');

// Get main amount
const getMainAmount = async (req, res) => {
  try {
    const mainAmount = await MainAmount.findOne();
    if (!mainAmount) {
      return res.status(404).json({ message: 'Main amount not found' });
    }
    res.json(mainAmount);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching main amount', error: error.message });
  }
};

// Update main amount
const updateMainAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    let mainAmount = await MainAmount.findOne();

    if (!mainAmount) {
      // If no document exists, create one
      mainAmount = new MainAmount({ amount });
    } else {
      mainAmount.amount = amount; // Update the existing document
    }

    await mainAmount.save();
    res.json(mainAmount);
  } catch (error) {
    res.status(500).json({ message: 'Error updating main amount', error: error.message });
  }
};

module.exports = { getMainAmount, updateMainAmount };