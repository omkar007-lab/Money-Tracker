const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const dataRoutes = require('./routes/data.js'); // Import combined data routes

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Enable JSON parsing for POST requests

// Use combined routes for mainAmount and transactions
app.use('/api', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);  // Log the error details for debugging
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Server setup
const PORT = process.env.PORT || 5325; // Default to port 5325
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
