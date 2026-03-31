import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MapTab from './components/Map/MapTab';
import WalletTab from './components/Wallet/WalletTab';
import BookingTab from './components/Booking/BookingTab';
import DriverTab from './components/Driver/DriverTab';
import NotificationToast from './components/Layout/NotificationToast';
import QuickTopupModal from './components/Modals/QuickTopupModal';
import QRCodeModal from './components/Modals/QRCodeModal';
import NotificationsModal from './components/Modals/NotificationsModal';
import LoginModal from './components/Auth/LoginModal';
import ProfileModal from './components/Modals/ProfileModal';
import SettingsModal from './components/Modals/SettingsModal';
import LoadingSpinner from './components/Layout/LoadingSpinner';
import AdminGuard from './components/Auth/AdminGuard';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { ABSINProvider } from './contexts/ABSINContext';
import { loadIcons } from './utils/iconLoader';
import './App.css';

function AppContent() {
  const [showLanding, setShowLanding] = useState(true);
  const [currentTab, setCurrentTab] = useState('map');
  const [modalOpen, setModalOpen] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    loadIcons();
  }, [currentTab, modalOpen]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // Show landing page first
  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  // Admin-only pages wrapped with AdminGuard
  const renderAdminContent = () => {
    if (currentTab === 'driver') {
      return (
        <AdminGuard requiredRole="driver">
          <DriverTab />
        </AdminGuard>
      );
    }

    return (
      <>
        {currentTab === 'map' && <MapTab />}
        {currentTab === 'wallet' && <WalletTab onOpenModal={setModalOpen} />}
        {currentTab === 'booking' && <BookingTab />}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto custom-scrollbar min-h-screen">
        {/* Header only shows on Map/Live Tracking tab */}
        {currentTab === 'map' && (
          <Header 
            onOpenModal={setModalOpen} 
            user={user} 
            onLoginClick={() => setModalOpen('login')} 
          />
        )}
        
        {renderAdminContent()}
      </main>
      
      <NotificationToast />
      
      {/* Modals */}
      <QuickTopupModal 
        isOpen={modalOpen === 'quickTopup'} 
        onClose={() => setModalOpen(null)} 
      />
      <QRCodeModal 
        isOpen={modalOpen === 'qrCode'} 
        onClose={() => setModalOpen(null)} 
      />
      <NotificationsModal 
        isOpen={modalOpen === 'notifications'} 
        onClose={() => setModalOpen(null)} 
      />
      <LoginModal 
        isOpen={modalOpen === 'login'} 
        onClose={() => setModalOpen(null)} 
      />
      <ProfileModal 
        isOpen={modalOpen === 'profile'} 
        onClose={() => setModalOpen(null)} 
      />
      <SettingsModal 
        isOpen={modalOpen === 'settings'} 
        onClose={() => setModalOpen(null)} 
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <WalletProvider>
          <MapProvider>
            <BookingProvider>
              <ABSINProvider>
                <AppContent />
              </ABSINProvider>
            </BookingProvider>
          </MapProvider>
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;