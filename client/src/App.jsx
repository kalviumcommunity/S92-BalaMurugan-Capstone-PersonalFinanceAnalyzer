import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/items';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', category: '', type: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTransactions(data);
  };

  const startEdit = (transaction) => {
    setEditingId(transaction._id);
    setEditForm({
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchTransactions();
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteTransaction = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirmed) return;

    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTransactions();
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>SpendLens — Transactions</h1>

      {transactions.length === 0 && <p>No transactions yet.</p>}

      {transactions.map((t) => (
        <div key={t._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '12px', marginBottom: '10px' }}>
          {editingId === t._id ? (
            <div>
              <input
                name="amount"
                type="number"
                value={editForm.amount}
                onChange={handleEditChange}
                placeholder="Amount"
              />
              <input
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                placeholder="Category"
              />
              <input
                name="type"
                value={editForm.type}
                onChange={handleEditChange}
                placeholder="Type (income/expense)"
              />
              <button onClick={() => saveEdit(t._id)}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          ) : (
            <div>
              <p><strong>{t.category}</strong> — ₹{t.amount} ({t.type})</p>
              <button onClick={() => startEdit(t)}>Edit</button>
              <button onClick={() => deleteTransaction(t._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;