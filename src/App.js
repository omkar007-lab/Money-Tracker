import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const getCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 16); // Returns date and time up to minutes
};

function App() {
  const [expenseName, setExpenseName] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [mainAmount, setMainAmount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [expenseDate, setExpenseDate] = useState(getCurrentDateTime());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 10;
  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const { data: balanceData } = await axios.get('http://localhost:5325/api/mainAmount');
        const { data: transactionData } = await axios.get(
          `http://localhost:5325/api/transactions?page=${currentPage}&limit=${itemsPerPage}`
        );

        setMainAmount(balanceData?.amount || 0);
        setTransactions(transactionData?.transactions || []);
        setTotalTransactions(transactionData?.totalCount || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
        setTransactions([]);
        setTotalTransactions(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTransaction = {
      name: expenseName,
      description: expenseDescription,
      amount: parseFloat(expenseAmount), // Ensure the amount is parsed to a number
      datetime: expenseDate,
    };

    try {
      const { data: savedTransaction } = await axios.post('http://localhost:5325/api/transactions', newTransaction);
      const updatedAmount = mainAmount + newTransaction.amount;

      await axios.put('http://localhost:5325/api/mainAmount', { amount: updatedAmount });

      setMainAmount(updatedAmount);
      setTransactions([savedTransaction, ...transactions]);

      setExpenseName('');
      setExpenseDescription('');
      setExpenseAmount(0);
      setExpenseDate(getCurrentDateTime());
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Error adding transaction. Please try again.');
    }
  };

  const handleDeleteTransaction = async (id, amount) => {
    try {
      await axios.delete(`http://localhost:5325/api/transactions/${id}`);
      const updatedAmount = mainAmount - amount;

      await axios.put('http://localhost:5325/api/mainAmount', { amount: updatedAmount });

      setMainAmount(updatedAmount);
      setTransactions(transactions.filter((transaction) => transaction._id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Expense Tracker</h1>
      </header>

      <section className="main-amount">
        <h2>Current Balance:</h2>
        <p>
          {currencySymbols[currency]} {mainAmount.toFixed(2)}
        </p>
      </section>

      <section className="transaction-form-section">
        <h3>Add a New Transaction</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Expense Name</label>
            <input
              type="text"
              value={expenseName}
              placeholder="Enter the name of the expense (e.g., groceries, dining out)"
              onChange={(e) => setExpenseName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Expense Description</label>
            <textarea
              value={expenseDescription}
              placeholder="Describe the expense: What was it for? Any notes?"
              onChange={(e) => setExpenseDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="Adjust your expense: Add (+) or subtract (-) money"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Date and Time</label>
            <input
              type="datetime-local"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Transaction</button>
        </form>
      </section>

      <section className="transaction-list">
        <h3>Transactions</h3>
        {isLoading ? (
          <p>Loading transactions...</p>
        ) : transactions?.length === 0 ? (
          <p>No transactions available.</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id}>
                <div>{transaction.name}</div>
                <div>{transaction.description}</div>
                <div>{transaction.amount}</div>
                <div>{new Date(transaction.datetime).toLocaleString()}</div>
                <button onClick={() => handleDeleteTransaction(transaction._id, transaction.amount)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </button>
          <button
            disabled={currentPage * itemsPerPage >= totalTransactions}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
