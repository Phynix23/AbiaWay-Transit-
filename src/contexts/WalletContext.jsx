import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  // Change initial balance from 12450 to 0
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]); // Start with empty transactions

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

  // Optional: Add a method to refresh balance from ABSIN
  const refreshBalance = async () => {
    // This would call ABSIN API to get real balance
    // For now, just return current balance
    return balance;
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addFunds, deductFunds, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
};