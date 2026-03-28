import { useState, useCallback } from 'react';
import { useABSIN } from '../contexts/ABSINContext';
import { useNotification } from '../contexts/NotificationContext';

export const useABSINPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const { service, readCard, processPayment, clearCard, activeCard, balance } = useABSIN();
  const { showNotification } = useNotification();

  const initiatePayment = useCallback(async (amount, rideDetails, onSuccess) => {
    setIsProcessing(true);
    
    try {
      let card = activeCard;
      
      if (!card) {
        // Read card if not already active
        card = await readCard('manual'); // Show manual entry modal
      }
      
      if (!card || card.success === false) {
        throw new Error('Failed to read card');
      }
      
      if (balance < amount) {
        throw new Error('Insufficient balance');
      }
      
      const result = await processPayment(amount, rideDetails);
      
      if (result.success) {
        setPaymentResult(result);
        showNotification('Payment Successful', `₦${amount} paid successfully`);
        onSuccess?.(result);
        return result;
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      showNotification('Payment Failed', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  }, [activeCard, balance, readCard, processPayment, showNotification]);

  const resetPayment = useCallback(() => {
    setPaymentResult(null);
    clearCard();
  }, [clearCard]);

  return {
    isProcessing,
    paymentResult,
    initiatePayment,
    resetPayment,
    activeCard,
    balance
  };
};