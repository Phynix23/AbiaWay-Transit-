import React, { useState, useEffect } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import CreditCard from './CreditCard';
import TransactionHistory from './TransactionHistory';
import ExchangeRate from './ExchangeRate';

const WalletTab = ({ onOpenModal }) => {
  const { balance, transactions, addFunds } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(1.0);

  useEffect(() => {
    // Simulate real-time exchange rate updates
    const interval = setInterval(() => {
      setExchangeRate(0.95 + Math.random() * 0.1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTopup = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (amount > 0) {
      addFunds(amount);
      setCustomAmount('');
    }
  };

  const quickAmounts = [1000, 2000, 5000, 10000, 20000];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <i data-lucide="wallet" className="w-6 h-6 text-green-400"></i>
          Your Wallet
        </h3>
        <div className="flex gap-2">
          <button 
            className="btn-secondary px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setShowExchange(!showExchange)}
          >
            <i data-lucide="refresh-cw" className="w-4 h-4"></i>
            {showExchange ? 'Hide Rates' : 'Exchange Rates'}
          </button>
          <button 
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2" 
            onClick={() => onOpenModal('quickTopup')}
          >
            <i data-lucide="plus" className="w-5 h-5"></i>
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {showExchange && <ExchangeRate rate={exchangeRate} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CreditCard balance={balance} />

          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold mb-4">Quick Top-up</h4>
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
              <i data-lucide="info" className="w-4 h-4"></i>
              Top-up fee: ₦50 (as per press release)
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  className={`topup-option p-3 text-center transition-all ${
                    selectedAmount === amount ? 'selected scale-105' : ''
                  }`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  <span className="block font-bold text-lg">₦{amount.toLocaleString()}</span>
                  <span className="text-xs text-green-400">+₦50 fee</span>
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-3 text-gray-400">₦</span>
                <input 
                  type="number" 
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Custom amount" 
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:border-primary"
                />
              </div>
              <button 
                className="btn-primary px-8 py-3"
                onClick={handleTopup}
              >
                Add Funds
              </button>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg flex items-center gap-3">
              <i data-lucide="gift" className="w-5 h-5 text-primary"></i>
              <p className="text-sm">
                <span className="font-semibold">Bonus:</span> Get 5% extra on top-ups above ₦10,000
              </p>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <i data-lucide="qr-code" className="text-primary"></i>
              QR Code Payment
            </h3>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="qr-code bg-white p-4 rounded-xl">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs text-center p-2 rounded-lg">
                  <div>
                    <i data-lucide="bus" className="w-8 h-8 mx-auto mb-2"></i>
                    Scan to Pay
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-2">Scan QR code to pay for your ride</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <i data-lucide="check-circle" className="w-3 h-3 text-green-400"></i>
                  Available at all bus terminals
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="btn-secondary text-sm px-4 py-2" onClick={() => onOpenModal('qrCode')}>
                    <i data-lucide="qr-code" className="w-4 h-4 inline mr-2"></i>
                    Generate QR
                  </button>
                  <button className="btn-secondary text-sm px-4 py-2">
                    <i data-lucide="download" className="w-4 h-4 inline mr-2"></i>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <TransactionHistory transactions={transactions} />
          
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <i data-lucide="trending-up" className="text-primary"></i>
              Spending Insights
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">This week</span>
                  <span className="font-semibold">₦2,450</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Last week</span>
                  <span className="font-semibold">₦3,800</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '45%' }}></div>
                </div>
              </div>
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <i data-lucide="trending-down" className="w-3 h-3"></i>
                15% less than last week
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTab;