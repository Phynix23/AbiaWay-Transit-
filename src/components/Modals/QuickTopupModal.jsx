import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotification } from '../../contexts/NotificationContext';

const QuickTopupModal = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { addFunds } = useWallet();
  const { showNotification } = useNotification();

  if (!isOpen) return null;

  const suggestedAmounts = [1000, 2000, 5000, 10000, 20000];
  const fee = 50;

  const handleTopup = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (amount > 0) {
      addFunds(amount);
      showNotification('Top-up Successful', `₦${amount.toLocaleString()} added to your wallet!`);
      onClose();
      setCustomAmount('');
    }
  };

  const getBonusMessage = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (amount >= 10000) {
      const bonus = Math.floor(amount * 0.05);
      return `+ ${bonus.toLocaleString()} bonus points!`;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay absolute inset-0" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Quick Top-up</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <i data-lucide="x" className="w-6 h-6"></i>
            </button>
          </div>
          
          {/* Quick Amount Buttons */}
          {showSuggestions && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400">Suggested amounts:</p>
                <button 
                  className="text-xs text-gray-500 hover:text-gray-300"
                  onClick={() => setShowSuggestions(false)}
                >
                  Hide
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {suggestedAmounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      selectedAmount === amount 
                        ? 'bg-green-600 text-white border-green-600 scale-105' 
                        : 'bg-white/5 border border-white/10 hover:border-green-600'
                    }`}
                  >
                    <span className="block font-bold text-lg">₦{amount.toLocaleString()}</span>
                    <span className="text-xs opacity-80">+₦{fee} fee</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Amount Input */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Or enter custom amount</label>
            <div className="flex">
              <span className="px-4 py-3 bg-gray-800 rounded-l-lg border border-r-0 border-gray-700">₦</span>
              <input 
                type="number" 
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="input-field flex-1 px-4 py-3 rounded-r-lg" 
                placeholder="Enter amount"
              />
            </div>
            {getBonusMessage() && (
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <i data-lucide="gift" className="w-3 h-3"></i>
                {getBonusMessage()}
              </p>
            )}
          </div>

          {/* Summary */}
          {((customAmount && parseInt(customAmount) > 0) || selectedAmount) && (
            <div className="p-3 bg-white/5 rounded-lg mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Amount:</span>
                <span>₦{(customAmount ? parseInt(customAmount) : selectedAmount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fee:</span>
                <span className="text-yellow-400">₦{fee}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-white/10 mt-1">
                <span>Total:</span>
                <span className="text-primary">₦{((customAmount ? parseInt(customAmount) : selectedAmount) + fee).toLocaleString()}</span>
              </div>
            </div>
          )}
          
          <button 
            className="w-full btn-primary py-3 rounded-lg font-semibold"
            onClick={handleTopup}
          >
            Add Funds
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Minimum top-up: ₦50 | Fee: ₦{fee} per transaction
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickTopupModal;