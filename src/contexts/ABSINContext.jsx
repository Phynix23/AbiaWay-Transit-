import React, { createContext, useContext, useState, useEffect } from 'react';
import { getABSINService } from '../services/absin';

const ABSINContext = createContext();

export const useABSIN = () => useContext(ABSINContext);

export const ABSINProvider = ({ children }) => {
  const [service, setService] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const init = async () => {
      const absinService = getABSINService();
      const result = await absinService.initialize();
      
      if (result.success) {
        setService(absinService);
        setIsInitialized(true);
      }
    };
    
    init();
  }, []);

  const readCard = async (method = 'auto') => {
    if (!service) return null;
    
    const card = await service.readCard(method);
    
    if (card && card.success !== false) {
      setActiveCard(card);
      const balanceData = await service.paymentProcessor.checkBalance(card.cardId);
      setBalance(balanceData.balance);
      const pointsData = await service.getCardPoints();
      setPoints(pointsData.total);
    }
    
    return card;
  };

  const processPayment = async (amount, rideDetails) => {
    if (!service) return null;
    
    const result = await service.processPayment(amount, rideDetails);
    
    if (result.success) {
      setBalance(result.balance);
      if (result.pointsEarned) {
        setPoints(prev => prev + result.pointsEarned);
      }
    }
    
    return result;
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

  return (
    <ABSINContext.Provider value={value}>
      {children}
    </ABSINContext.Provider>
  );
};