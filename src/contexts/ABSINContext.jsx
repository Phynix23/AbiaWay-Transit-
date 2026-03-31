import React, { createContext, useState, useContext, useEffect } from 'react';
import { getABSINService } from '../services/absin';

const ABSINContext = createContext(null);

export const useABSIN = () => {
  const context = useContext(ABSINContext);
  if (!context) {
    throw new Error('useABSIN must be used within an ABSINProvider');
  }
  return context;
};

export const ABSINProvider = ({ children }) => {
  const [service, setService] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const absinService = getABSINService();
        const result = await absinService.initialize();
        
        if (result.success) {
          setService(absinService);
          setIsInitialized(true);
          console.log('✅ ABSIN Service initialized');
        } else {
          console.warn('⚠️ ABSIN Service initialization returned false');
          // Still set a dummy service so the app doesn't crash
          setService(absinService);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('❌ ABSIN initialization error:', error);
        // Create a dummy service that won't crash
        const dummyService = getABSINService();
        setService(dummyService);
        setIsInitialized(true);
      }
    };
    
    init();
  }, []);

  const readCard = async (method = 'auto') => {
    if (!service) return null;
    try {
      const card = await service.readCard(method);
      if (card && card.success !== false) {
        setActiveCard(card);
        if (card.balance) setBalance(card.balance);
        return card;
      }
      return null;
    } catch (error) {
      console.error('Read card error:', error);
      return null;
    }
  };

  const processPayment = async (amount, rideDetails) => {
    if (!service) return null;
    try {
      const result = await service.processPayment(amount, rideDetails);
      if (result.success) {
        setBalance(result.balance);
        if (result.pointsEarned) {
          setPoints(prev => prev + result.pointsEarned);
        }
      }
      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: error.message };
    }
  };

  const clearCard = () => {
    setActiveCard(null);
    if (service) {
      service.clearActiveCard();
    }
  };

  const value = {
    service,
    isInitialized,
    activeCard,
    balance,
    points,
    readCard,
    processPayment,
    clearCard
  };

  return <ABSINContext.Provider value={value}>{children}</ABSINContext.Provider>;
};