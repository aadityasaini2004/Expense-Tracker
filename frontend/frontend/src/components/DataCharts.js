// src/components/DataCharts.js
import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DataCharts = ({ transactions }) => {
  // --- Prepare data for Pie Chart (Expense by Category) ---
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expenseData),
    datasets: [{
      data: Object.values(expenseData),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#7C8C9A'
      ],
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#7C8C9A'
      ]
    }]
  };

  // --- Prepare data for Bar Chart (Monthly Income vs. Expense) ---
  const monthlyData = Array(12).fill(0).map(() => ({ income: 0, expense: 0 }));
  transactions.forEach(t => {
    const month = new Date(t.date).getMonth(); // 0 = Jan, 11 = Dec
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expense += t.amount;
    }
  });

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#4BC0C0',
        data: monthlyData.map(d => d.income)
      },
      {
        label: 'Expense',
        backgroundColor: '#FF6384',
        data: monthlyData.map(d => d.expense)
      }
    ]
  };

  const chartContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem'
  };

  return (
    <div style={chartContainerStyle}>
      <div>
        <h3>Expense Distribution</h3>
        {Object.keys(expenseData).length > 0 ? <Pie data={pieChartData} /> : <p>No expense data to display.</p>}
      </div>
      <div>
        <h3>Monthly Summary</h3>
        <Bar data={barChartData} />
      </div>
    </div>
  );
};

export default DataCharts;
