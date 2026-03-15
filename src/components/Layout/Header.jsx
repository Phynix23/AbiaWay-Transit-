import React, { useState, useEffect } from 'react';

const Header = ({ onOpenModal, user, onLoginClick }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  const handleSOS = () => {
    if (window.confirm('🚨 Emergency SOS? This will alert emergency services and share your location.')) {
      // In production, this would call actual emergency services
      alert('SOS alert sent to Abia State Emergency Services');
    }
  };

  return (
    <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold mb-1">
          {greeting}, {user?.name || 'Abuoma'}! 👋
        </h2>
        <p className="text-gray-400 text-sm flex items-center flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </span>
          <span>Abia State Transit ⚡</span>
          <span>v1.0.0</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            {user?.tier || 'Premium'} Member
          </span>
          <span>{currentDate}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          className="btn-secondary p-2 relative tooltip" 
          data-tooltip="Notifications" 
          onClick={() => onOpenModal('notifications')}
        >
          <i data-lucide="bell" className="w-5 h-5"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        </button>
        
        <button 
          className="sos-button px-4 py-2 rounded-lg flex items-center gap-2" 
          onClick={handleSOS}
        >
          <i data-lucide="shield-alert" className="w-5 h-5"></i>
          <span className="hidden lg:inline">SOS</span>
        </button>
        
        {user ? (
          <div className="relative">
            <button 
              className="btn-secondary px-3 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">{user.name.charAt(0)}</span>
              </div>
              <span className="hidden lg:inline">{user.name}</span>
              <i data-lucide="chevron-down" className="w-4 h-4"></i>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card py-2 z-50">
                <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 transition">
                  <i data-lucide="user" className="w-4 h-4 inline mr-2"></i>
                  Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm hover:bg-white/5 transition">
                  <i data-lucide="settings" className="w-4 h-4 inline mr-2"></i>
                  Settings
                </a>
                <hr className="my-2 border-white/10" />
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition"
                  onClick={() => alert('Logout clicked')}
                >
                  <i data-lucide="log-out" className="w-4 h-4 inline mr-2"></i>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="btn-primary px-4 py-2 rounded-lg"
            onClick={onLoginClick}
          >
            <i data-lucide="log-in" className="w-4 h-4 inline mr-2"></i>
            Sign In
          </button>
        )}
        
        <button 
          className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2" 
          onClick={() => onOpenModal('quickTopup')}
        >
          <i data-lucide="plus" className="w-5 h-5"></i>
          <span className="hidden sm:inline">Quick Top-up</span>
        </button>
      </div>
    </header>
  );
};

export default Header;