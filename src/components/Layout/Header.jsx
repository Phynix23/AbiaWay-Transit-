import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Header = ({ onOpenModal, user, onLoginClick }) => {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { logout } = useAuth();
  const { showNotification } = useNotification();

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
      alert('SOS alert sent to Abia State Emergency Services');
    }
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      showNotification('Logged Out', 'You have been successfully logged out', 'success');
      setShowUserMenu(false);
      // Reload to reset app state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      showNotification('Error', 'Failed to log out', 'error');
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
        {/* SOS Button */}
        <button 
          className="sos-button px-4 py-2 rounded-lg flex items-center gap-2" 
          onClick={handleSOS}
        >
          <i data-lucide="shield-alert" className="w-5 h-5"></i>
          <span className="hidden lg:inline">SOS</span>
        </button>
        
        {/* Sign In Button - Only shows when NOT logged in */}
        {!user && (
          <button 
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={onLoginClick}
          >
            <i data-lucide="log-in" className="w-5 h-5"></i>
            <span>Sign In</span>
          </button>
        )}
        
        {/* User Menu - Shows when logged in */}
        {user && (
          <div className="relative">
            <button 
              className="btn-secondary px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-white/20 transition"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                <span className="font-bold text-sm">{user.avatar || user.name?.charAt(0) || 'U'}</span>
              </div>
              <span className="hidden lg:inline">{user.name}</span>
              <i data-lucide="chevron-down" className="w-4 h-4 transition-transform duration-200" style={{ transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0)' }}></i>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 glass-card py-2 z-50 shadow-xl animate-slideDown">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-bg rounded-full flex items-center justify-center">
                      <span className="font-bold text-base">{user.avatar || user.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email || user.role || 'Passenger'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Profile Button */}
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenModal('profile');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition flex items-center gap-3"
                >
                  <i data-lucide="user" className="w-4 h-4 text-gray-400"></i>
                  <span>My Profile</span>
                </button>
                
                {/* Settings Button */}
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenModal('settings');
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition flex items-center gap-3"
                >
                  <i data-lucide="settings" className="w-4 h-4 text-gray-400"></i>
                  <span>Settings</span>
                </button>
                
                <hr className="my-2 border-white/10" />
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition flex items-center gap-3"
                >
                  <i data-lucide="log-out" className="w-4 h-4"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Quick Top-up Button - Always visible */}
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