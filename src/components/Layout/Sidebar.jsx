import React from 'react';

const Sidebar = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'map', icon: 'map', label: 'Live Tracking' },
    { id: 'wallet', icon: 'wallet', label: 'My Wallet' },
    { id: 'booking', icon: 'ticket', label: 'Book & Pay' },
    { id: 'driver', icon: 'truck', label: 'Driver Dashboard' }
  ];

  return (
    <aside className="sidebar w-64 hidden lg:block fixed h-full p-6 overflow-y-auto custom-scrollbar">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
          <i data-lucide="zap" className="text-white w-6 h-6"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold">AbiaWay</h1>
          <p className="text-xs text-gray-400">AW Transit v1.0</p>
        </div>
      </div>

      <nav className="space-y-2">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`nav-item ${currentTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <i data-lucide={tab.icon} className="w-5 h-5"></i>
            <span>{tab.label}</span>
            {tab.id === 'map' && (
              <span className="live-indicator ml-auto flex items-center gap-1">
                <span className="live-dot"></span>
                <span className="text-xs">LIVE</span>
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
              <span className="font-bold text-sm">AD</span>
            </div>
            <div>
              <p className="font-medium text-sm">Abuoma David</p>
              <p className="text-xs text-gray-400">Premium Member</p>
            </div>
          </div>
          <div className="progress-bar mb-2">
            <div className="progress-fill" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-400">450/600 pts to Level 6</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span className="language-badge">EN</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Connected
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;