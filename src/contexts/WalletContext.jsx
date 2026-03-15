import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(12450);
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'debit', description: 'Green Shuttle - Osisioma', amount: 150, date: 'Today, 8:45 AM' },
    { id: 2, type: 'credit', description: 'Wallet Top-up', amount: 2000, date: 'Yesterday, 6:30 PM' },
    { id: 3, type: 'debit', description: 'Green Shuttle - Park to Flyover', amount: 150, date: 'Yesterday, 9:15 AM' },
  ]);

  const addFunds = (amount) => {
    setBalance(prev => prev + amount);
    addTransaction({
      type: 'credit',
      description: 'Wallet Top-up',
      amount,
      date: new Date().toLocaleString()
    });
  };

  const deductFunds = (amount, description) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      addTransaction({
        type: 'debit',
        description,
        amount,
        date: new Date().toLocaleString()
      });
      return true;
    }
    return false;
  };

  const addTransaction = (transaction) => {
    setTransactions(prev => [{
      id: Date.now(),
      ...transaction
    }, ...prev].slice(0, 10));
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addFunds, deductFunds }}>
      {children}
    </WalletContext.Provider>
  );
};