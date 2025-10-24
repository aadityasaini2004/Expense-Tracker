// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTransactions, addTransaction, deleteTransaction } from '../service/transactionService';
import Loader from '../components/Loader';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ title: '', amount: '', type: 'expense', category: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = await addTransaction(formData);
      setTransactions([newTransaction, ...transactions]);
      setFormData({ title: '', amount: '', type: 'expense', category: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add transaction.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction.');
      console.error(err);
    }
  };

  if (loading) return <Loader />;
  
  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h2>Add New Transaction</h2>
      <form onSubmit={handleAddTransaction} className={styles.form}>
        <input type="text" placeholder="Title" name="title" value={formData.title} onChange={handleInputChange} required />
        <input type="number" placeholder="Amount" name="amount" value={formData.amount} onChange={handleInputChange} required />
        <select name="type" value={formData.type} onChange={handleInputChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="text" placeholder="Category" name="category" value={formData.category} onChange={handleInputChange} required />
        <button type="submit">Add Transaction</button>
      </form>

      <h2>Your Transactions</h2>
      <ul className={styles.transactionList}>
        <AnimatePresence>
          {transactions.length > 0 ? (
            transactions.map(t => (
              <motion.li 
                key={t._id} 
                className={styles.transactionItem}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <span>{t.title}: <strong>${t.amount}</strong> ({t.type}) - <em>{t.category}</em></span>
                <button onClick={() => handleDelete(t._id)} className={styles.deleteButton}>Delete</button>
              </motion.li>
            ))
          ) : (
            !loading && <p>You have no transactions yet. Add one to get started!</p>
          )}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

export default Dashboard;
