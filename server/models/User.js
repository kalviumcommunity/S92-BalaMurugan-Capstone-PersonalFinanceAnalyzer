const Transaction = require('./models/Transaction');

// CREATE - Add a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();          // WRITE to DB
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();  // READ from DB
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});