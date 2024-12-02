const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MainAmount = require('./models/mainAmountModel');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const seedMainAmount = async () => {
  try {
    const existing = await MainAmount.findOne();
    if (!existing) {
      const newMainAmount = new MainAmount({ amount: 0 });
      await newMainAmount.save();
      console.log('Main amount seeded successfully');
    } else {
      console.log('Main amount already exists');
    }
    process.exit();
  } catch (error) {
    console.error('Error seeding main amount:', error.message);
    process.exit(1);
  }
};

seedMainAmount();
