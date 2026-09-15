require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Transaction = require('./models/Transaction'); // adjust path if needed

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to let Express understand JSON request bodies
app.use(express.json());

// WRITE (Create a transaction)
app.post('/api/items', async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ (Get all transactions)
app.get('/api/items', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ (Get a single transaction by ID)
app.get('/api/items/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const User = require('./models/User');

// WRITE (Create a user)
app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
