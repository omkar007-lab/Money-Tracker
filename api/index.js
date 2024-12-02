// /api/index.js (or server.js or app.js depending on your structure)
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const transactionRoutes = require('./routes/transactions');
const mainAmountRoutes = require('./routes/mainAmount');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Enable JSON parsing for POST requests

// Routes
app.use('/api/transactions', transactionRoutes); // Transactions route
app.use('/api/mainAmount', mainAmountRoutes); // Main balance route

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Server setup
const PORT = process.env.PORT || 5325; // Default to port 5325
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
