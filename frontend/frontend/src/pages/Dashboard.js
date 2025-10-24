// src/pages/Dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from '../services/transactionService';
import Loader from '../components/Loader';
import DataCharts from '../components/DataCharts';

import { Container, Title, Paper, Group, Button, TextInput, NumberInput, Select, SimpleGrid, Text, ActionIcon, SegmentedControl } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconTrash, IconPencil } from '@tabler/icons-react';

const Dashboard = () => {
  // --- States ---
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date-desc');
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    initialValues: { title: '', amount: 0, type: 'expense', category: '', date: new Date() },
    validate: {
      title: (value) => (value.trim().length < 2 ? 'Title is too short' : null),
      amount: (value) => (value <= 0 ? 'Amount must be positive' : null),
      category: (value) => (value.trim().length < 2 ? 'Category is required' : null),
    },
  });

  // --- Data Fetching ---
  const fetchTransactions = async () => {
    try {
      // No need to setLoading(true) here, it's set on initial load
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
  useEffect(() => { fetchTransactions(); }, []);

  // --- Handlers ---
  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        // --- CORRECTED: Update logic ---
        const result = await updateTransaction(editingId, values);
        setTransactions(transactions.map(t => (t._id === editingId ? result : t)));
      } else {
        // --- CORRECTED: Add logic ---
        const result = await addTransaction(values);
        setTransactions([result, ...transactions]);
      }
      form.reset();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save transaction.');
    }
  };

  const handleEditClick = (transaction) => {
    setEditingId(transaction._id);
    form.setValues({
        ...transaction,
        date: new Date(transaction.date)
    });
  };
  
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete transaction.');
    }
  };
  
  // --- CORRECTED: Memoized function with state copy ---
  const filteredAndSortedTransactions = useMemo(() => {
    return [...transactions] // Create a copy here to prevent mutation
      .filter(t => filter === 'all' || t.type === filter)
      .sort((a, b) => {
        switch (sort) {
          case 'date-asc': return new Date(a.date) - new Date(b.date);
          case 'amount-desc': return b.amount - a.amount;
          case 'amount-asc': return a.amount - b.amount;
          default: return new Date(b.date) - new Date(a.date);
        }
      });
  }, [transactions, filter, sort]);

  if (loading) return <Loader />;
  
  return (
    <Container size="lg" my="xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Title order={1} mb="xl">Dashboard</Title>
        {error && <Text c="red" mb="md">{error}</Text>}
        
        <DataCharts transactions={transactions} />

        <Paper withBorder shadow="md" p="lg" my="xl" radius="md">
          <Title order={3} mb="md">{editingId ? 'Edit Transaction' : 'Add New Transaction'}</Title>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              <TextInput label="Title" placeholder="e.g., Coffee" {...form.getInputProps('title')} />
              <NumberInput label="Amount" placeholder="e.g., 5.00" min={0} precision={2} {...form.getInputProps('amount')} />
              <Select label="Type" data={['expense', 'income']} {...form.getInputProps('type')} />
              <TextInput label="Category" placeholder="e.g., Food" {...form.getInputProps('category')} />
              <DatePickerInput label="Date" placeholder="Select date" {...form.getInputProps('date')} />
            </SimpleGrid>
            <Group justify="flex-end" mt="md">
              {editingId && <Button variant="default" onClick={() => { setEditingId(null); form.reset(); }}>Cancel</Button>}
              <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
            </Group>
          </form>
        </Paper>

        <Group justify="space-between" mb="md">
          <Title order={3}>Your Transactions</Title>
          <Group>
            <SegmentedControl
              value={filter}
              onChange={setFilter}
              data={[
                { label: 'All', value: 'all' },
                { label: 'Income', value: 'income' },
                { label: 'Expenses', value: 'expense' },
              ]}
            />
            <Select
              value={sort}
              onChange={setSort}
              data={[
                { value: 'date-desc', label: 'Date (Newest)' },
                { value: 'date-asc', label: 'Date (Oldest)' },
                { value: 'amount-desc', label: 'Amount (High-Low)' },
                { value: 'amount-asc', label: 'Amount (Low-High)' },
              ]}
            />
          </Group>
        </Group>

        <AnimatePresence>
          {filteredAndSortedTransactions.map(t => (
            <motion.div key={t._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 50 }}>
              <Paper withBorder p="md" radius="md" mb="sm">
                <Group justify="space-between">
                  <div>
                    <Text fw={500}>{t.title}</Text>
                    <Text c="dimmed" size="sm">{t.category}</Text>
                  </div>
                  <Group>
                    <Text fw={700} c={t.type === 'income' ? 'teal' : 'red'}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </Text>
                    <ActionIcon variant="default" onClick={() => handleEditClick(t)}><IconPencil size={16} /></ActionIcon>
                    <ActionIcon color="red" variant="light" onClick={() => handleDelete(t._id)}><IconTrash size={16} /></ActionIcon>
                  </Group>
                </Group>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredAndSortedTransactions.length === 0 && !loading && <Text c="dimmed" ta="center" mt="xl">No transactions to display.</Text>}
      </motion.div>
    </Container>
  );
};

export default Dashboard;
