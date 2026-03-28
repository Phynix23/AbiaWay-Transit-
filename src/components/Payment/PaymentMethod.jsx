import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import ABSINPaymentDemo from './ABSINPaymentDemo';

const PaymentMethod = ({ selected, onSelect, rideDetails, amount, onSuccess }) => {
  const { balance } = useWallet();
  const [showABSINModal, setShowABSINModal] = useState(false);

  const paymentMethods = [
    {
      id: 'absin',
      name: 'ABSIN Card',
      icon: 'credit-card',
      description: 'Tap or enter your ABSIN card details',
      badge: 'Fast & Secure',
      color: 'purple',
      onClick: () => setShowABSINModal(true)
    },
    {
      id: 'wallet',
      name: 'Wallet Balance',
      icon: 'wallet',
      description: `₦${balance.toLocaleString()} available • 5% cashback`,
      badge: 'Cashback',
      color: 'green'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit-card',
      description: 'Visa, Mastercard, Verve',
      badge: 'Secure',
      color: 'blue'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: 'qr-code',
      description: 'Scan at terminal',
      badge: 'Instant',
      color: 'yellow'
    }
  ];

  const handlePaymentMethodClick = (method) => {
    if (method.id === 'absin') {
      method.onClick();
    } else {
      onSelect(method.id);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Payment Method</h3>
        <p className="text-sm text-gray-400 mb-2">
          Amount: <span className="text-primary font-bold">₦{amount?.toLocaleString() || 0}</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className={`payment-method p-4 border-2 rounded-xl cursor-pointer transition-all hover:scale-[1.02] ${
                selected === method.id && method.id !== 'absin'
                  ? `border-${method.color}-500 bg-${method.color}-500/10` 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => handlePaymentMethodClick(method)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full bg-${method.color}-500/20 flex items-center justify-center`}>
                  <i data-lucide={method.icon} className={`w-5 h-5 text-${method.color}-400`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{method.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 bg-${method.color}-500/20 text-${method.color}-400 rounded-full`}>
                      {method.badge}
                    </span>
                  </div>
                </div>
                {selected === method.id && method.id !== 'absin' && (
                  <div className={`w-5 h-5 rounded-full border-2 border-${method.color}-500 bg-${method.color}-500 flex items-center justify-center`}>
                    <i data-lucide="check" className="w-4 h-4 text-white"></i>
                  </div>
                )}
                {method.id === 'absin' && (
                  <div className="w-5 h-5 rounded-full border-2 border-purple-500 flex items-center justify-center">
                    <i data-lucide="arrow-right" className="w-4 h-4 text-purple-400"></i>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Test Cards Section for ABSIN */}
        <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <i data-lucide="credit-card" className="w-4 h-4 text-purple-400"></i>
            Test ABSIN Cards:
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="font-mono">1234 5678 9012 3456</span>
              <span className="text-green-400">PIN: 1234 • ₦12,450</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">1111 2222 3333 4444</span>
              <span className="text-yellow-400">PIN: 1234 • ₦5,000</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">5555 6666 7777 8888</span>
              <span className="text-purple-400">PIN: 1234 • ₦25,000</span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg flex items-center gap-3">
          <i data-lucide="shield" className="w-8 h-8 text-green-400"></i>
          <div>
            <p className="font-semibold">Secure Payment</p>
            <p className="text-xs text-gray-400">Your payment information is encrypted and secure</p>
          </div>
        </div>
      </div>

      {/* ABSIN Payment Modal */}
      {showABSINModal && (
        <ABSINPaymentDemo
          onClose={() => setShowABSINModal(false)}
          rideDetails={rideDetails}
          amount={amount}
          onSuccess={(result) => {
            onSuccess?.(result);
            setShowABSINModal(false);
          }}
        />
      )}
    </>
  );
};

export default PaymentMethod;