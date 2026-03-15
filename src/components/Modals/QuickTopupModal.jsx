import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotification } from '../../contexts/NotificationContext';

const QuickTopupModal = ({ isOpen, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const { addFunds } = useWallet();
  const { showNotification } = useNotification();

  if (!isOpen) return null;

  const handleTopup = () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (amount > 0) {
      addFunds(amount);
      showNotification('Top-up Successful', `₦${amount.toLocaleString()} added to your wallet!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay absolute inset-0" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4">
        <div className="glass-card p-6 slide-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Quick Top-up</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <i data-lucide="x" className="w-6 h-6"></i>
            </button>
          </div>
          
          <div className="space-y-3 mb-6">
            {[1000, 2000, 5000].map(amount => (
              <div 
                key={amount}
                className={`topup-option ${selectedAmount === amount ? 'selected' : ''}`}
                onClick={() => setSelectedAmount(amount)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">₦{amount.toLocaleString()}</span>
                  <span className="text-green-400 text-sm">Fee: ₦50</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Custom Amount</label>
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
          </div>
          
          <button className="w-full btn-primary py-3 rounded-lg font-semibold" onClick={handleTopup}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickTopupModal;