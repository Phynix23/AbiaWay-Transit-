import React, { useState, useEffect } from 'react';
import LandingPage from './components/Landing/LandingPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import MapTab from './components/Map/MapTab';
import WalletTab from './components/Wallet/WalletTab';
import BookingTab from './components/Booking/BookingTab';
import DriverTab from './components/Driver/DriverTab';
import NotificationToast from './components/Layout/NotificationToast';
import QuickTopupModal from './components/Modals/QuickTopupModal';
import QRCodeModal from './components/Modals/QRCodeModal';
import NotificationsModal from './components/Modals/NotificationsModal';
import LoginModal from './components/Auth/LoginModal';
import LoadingSpinner from './components/Layout/LoadingSpinner';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MapProvider } from './contexts/MapContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { loadIcons } from './utils/iconLoader';
import './App.css';

function AppContent() {
  const [showLanding, setShowLanding] = useState(true); // Start with landing page
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

  // Show main app after landing
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto custom-scrollbar min-h-screen">
        <Header 
          onOpenModal={setModalOpen} 
          user={user} 
          onLoginClick={() => setModalOpen('login')} 
        />
        
        {currentTab === 'map' && <MapTab />}
        {currentTab === 'wallet' && <WalletTab onOpenModal={setModalOpen} />}
        {currentTab === 'booking' && <BookingTab />}
        {currentTab === 'driver' && <DriverTab />}
        
        <Footer />
      </main>
      
      <NotificationToast />
      
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
              <AppContent />
            </BookingProvider>
          </MapProvider>
        </WalletProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;