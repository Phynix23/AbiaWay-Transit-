import React, { useState } from 'react';

const TransactionHistory = ({ transactions }) => {
  const [filter, setFilter] = useState('all');

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  const getIcon = (type) => {
    return type === 'credit' ? 'arrow-down-left' : 'arrow-up-right';
  };

  const getColor = (type) => {
    return type === 'credit' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <i data-lucide="history" className="text-primary"></i>
          Transactions
        </h3>
        <div className="flex gap-1 bg-white/10 rounded-lg p-1">
          <button
            className={`px-3 py-1 rounded-lg text-xs transition ${
              filter === 'all' ? 'bg-primary text-white' : 'hover:bg-white/10'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-xs transition ${
              filter === 'credit' ? 'bg-green-600 text-white' : 'hover:bg-white/10'
            }`}
            onClick={() => setFilter('credit')}
          >
            Credits
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-xs transition ${
              filter === 'debit' ? 'bg-red-600 text-white' : 'hover:bg-white/10'
            }`}
            onClick={() => setFilter('debit')}
          >
            Debits
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
            <div key={tx.id} className={`transaction-item ${tx.type} p-3 hover:bg-white/5 transition rounded-lg`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  <i data-lucide={getIcon(tx.type)} className={`w-4 h-4 ${getColor(tx.type)}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className={`text-sm font-bold ${getColor(tx.type)}`}>
                      {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{tx.date}</p>
                    <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full">
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <i data-lucide="inbox" className="w-12 h-12 text-gray-600 mx-auto mb-3"></i>
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>

      <button className="w-full btn-secondary mt-4 py-2 text-sm">
        <i data-lucide="download" className="w-4 h-4 inline mr-2"></i>
        Download Statement
      </button>
    </div>
  );
};

export default TransactionHistory;