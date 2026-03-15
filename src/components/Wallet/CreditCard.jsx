import React from 'react';
import { Cpu } from 'lucide-react';

const CreditCard = ({ balance }) => {
  return (
    <div className="credit-card p-6 mb-6 floating">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm text-green-200 mb-1">ABIA STATE Government Issue</p>
          <p className="text-xs text-green-300 mono">ABIA-2026-4729</p>
        </div>
        <div className="chip">
          <Cpu className="w-6 h-6 text-amber-800" />
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-sm text-green-200 mb-1">Cardholder</p>
        <p className="text-xl font-bold tracking-wider">ABUOMA DAVID</p>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm text-green-200 mb-1">Valid Thru</p>
          <p className="font-mono">12/28</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-green-200 mb-1">Balance</p>
          <p className="text-2xl font-bold">₦{balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;