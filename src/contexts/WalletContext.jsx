import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  // Start with zero balance for new users
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

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

  // Refresh balance from payment service
  const refreshBalance = async () => {
    // In production, fetch from backend
    // For now, just return current balance
    return balance;
  };

  // Get current balance info
  const getBalance = () => {
    return {
      balance,
      currency: 'NGN',
      available: true
    };
  };

  // Get transaction history
  const getTransactionHistory = (limit = 10, offset = 0) => {
    return transactions.slice(offset, offset + limit);
  };

  // Clear all transactions (admin only)
  const clearTransactions = () => {
    setTransactions([]);
  };

  return (
    <WalletContext.Provider value={{ 
      balance, 
      transactions, 
      addFunds, 
      deductFunds, 
      refreshBalance,
      getBalance,
      getTransactionHistory,
      clearTransactions
    }}>
      {children}
    </WalletContext.Provider>
  );
};