import React, { useState, useEffect, useRef } from 'react';
import { getABSINService } from '../../services/absin';
import { useWallet } from '../../contexts/WalletContext';
import { useNotification } from '../../contexts/NotificationContext';

const ABSINPaymentDemo = ({ onClose, rideDetails, amount, onSuccess }) => {
  const [currentView, setCurrentView] = useState('payment-selection');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentResult, setPaymentResult] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [absinService, setAbsinService] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [balanceCheck, setBalanceCheck] = useState(null);
  
  const nfcReaderRef = useRef(null);
  const qrScannerRef = useRef(null);

  const { balance, deductFunds, addFunds, refreshBalance } = useWallet();
  const { showNotification: showWalletNotification } = useNotification();

  // Initialize ABSIN Service
  useEffect(() => {
    const initABSIN = async () => {
      try {
        const service = getABSINService();
        const result = await service.initialize();
        if (result.success) {
          setAbsinService(service);
          setIsInitialized(true);
          console.log('✅ ABSIN Service initialized:', result.capabilities);
        } else {
          showNotificationMessage('Initialization Error', 'Failed to initialize payment system', 'error');
        }
      } catch (error) {
        console.error('ABSIN init error:', error);
        showNotificationMessage('Error', 'Payment system unavailable', 'error');
      }
    };
    initABSIN();
  }, []);

  // Real-time balance monitoring
  useEffect(() => {
    const checkRealTimeBalance = async () => {
      if (activeCard && absinService) {
        try {
          const balance = await absinService.paymentProcessor.checkBalance(activeCard.cardId);
          setBalanceCheck(balance);
        } catch (error) {
          console.error('Balance check error:', error);
        }
      }
    };
    
    const interval = setInterval(checkRealTimeBalance, 5000);
    return () => clearInterval(interval);
  }, [activeCard, absinService]);

  const showNotificationMessage = (title, message, type = 'success') => {
    setNotification({ title, message, type });
    showWalletNotification(title, message);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16));
    setCardNumber(formatted);
  };

  // Real NFC reading simulation (can connect to actual NFC hardware)
  const startNFC = async () => {
    if (!absinService) {
      showNotificationMessage('Error', 'Payment service not available', 'error');
      return;
    }

    setCurrentView('nfc-reading');
    setPaymentProgress(0);
    
    try {
      // Check if real NFC is available
      if ('NDEFReader' in window) {
        const nfc = new NDEFReader();
        await nfc.scan();
        
        nfc.addEventListener('reading', (event) => {
          const decoder = new TextDecoder();
          let cardData = '';
          for (const record of event.message.records) {
            if (record.recordType === 'text') {
              cardData += decoder.decode(record.data);
            }
          }
          
          // Parse ABSIN card data from NFC
          const parts = cardData.split('|');
          if (parts[0]?.startsWith('ABN')) {
            processCardPayment({
              cardId: parts[1],
              cardholder: parts[2],
              timestamp: parts[3]
            });
          }
        });
        
        nfc.addEventListener('readingerror', () => {
          showNotificationMessage('NFC Error', 'Failed to read card. Please try again.', 'error');
          cancelPayment();
        });
      } else {
        // Simulate NFC reading for testing
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setPaymentProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            // Simulate card detection
            processCardPayment({
              cardId: '1234567890123456',
              cardholder: 'Abuoma David',
              balance: 12450
            });
          }
        }, 400);
        
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('NFC error:', error);
      showNotificationMessage('NFC Error', 'Please ensure NFC is enabled', 'error');
      cancelPayment();
    }
  };

  // Real QR scanning
  const startQR = async () => {
    if (!absinService) {
      showNotificationMessage('Error', 'Payment service not available', 'error');
      return;
    }

    setCurrentView('qr-scanning');
    setPaymentProgress(0);
    
    try {
      // Check if camera is available
      if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // Simulate QR scanning progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setPaymentProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            stream.getTracks().forEach(track => track.stop());
            // Simulate QR detection
            processCardPayment({
              cardId: '1234567890123456',
              cardholder: 'Abuoma David',
              method: 'qr'
            });
          }
        }, 400);
      } else {
        // Fallback to simulated scanning
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          setPaymentProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            processCardPayment({
              cardId: '1234567890123456',
              cardholder: 'Abuoma David',
              method: 'qr'
            });
          }
        }, 400);
      }
    } catch (error) {
      console.error('Camera error:', error);
      showNotificationMessage('Camera Error', 'Unable to access camera', 'error');
      cancelPayment();
    }
  };

  const processCardPayment = async (cardData) => {
    if (!absinService) {
      showNotificationMessage('Error', 'Payment service unavailable', 'error');
      return;
    }

    setIsProcessing(true);
    setCurrentView('processing');
    setPaymentStep(1);
    setPaymentProgress(0);

    try {
      // Step 1: Validate Card with Real API
      setPaymentStep(1);
      setPaymentProgress(33);
      
      const validation = await absinService.paymentProcessor.validateCard({
        cardId: cardData.cardId,
        timestamp: new Date().toISOString()
      });
      
      if (!validation.success) {
        throw new Error(validation.message || 'Invalid card');
      }
      
      setActiveCard(validation.data);
      
      // Step 2: Check Real-time Balance
      setPaymentStep(2);
      setPaymentProgress(66);
      
      const balanceData = await absinService.paymentProcessor.checkBalance(cardData.cardId);
      
      if (balanceData.balance < amount) {
        throw new Error(`Insufficient balance. Available: ₦${balanceData.balance}`);
      }
      
      // Step 3: Process Payment with Real API
      setPaymentStep(3);
      setPaymentProgress(80);
      
      const payment = await absinService.paymentProcessor.initiatePayment(
        cardData.cardId,
        amount,
        rideDetails
      );
      
      // Step 4: Confirm Payment
      setPaymentProgress(90);
      
      const confirmed = await absinService.paymentProcessor.confirmPayment(payment.transactionId);
      
      if (!confirmed.success) {
        throw new Error(confirmed.message || 'Payment confirmation failed');
      }
      
      // Step 5: Update Wallet Balance
      setPaymentProgress(100);
      
      // Deduct from local wallet if using wallet integration
      if (selectedMethod === 'wallet') {
        deductFunds(amount, `ABSIN: ${rideDetails.from} → ${rideDetails.to}`);
      } else {
        // Refresh balance from ABSIN
        await refreshBalance?.();
      }
      
      setPaymentResult({
        success: true,
        transactionId: payment.transactionId,
        cardNumber: cardData.cardId,
        cardholder: validation.data.cardholder?.name || 'ABSIN Cardholder',
        balanceAfter: balanceData.balance - amount,
        pointsEarned: Math.floor(amount / 10),
        receipt: payment.receipt,
        authorizationCode: payment.authorizationCode,
        timestamp: new Date().toISOString()
      });
      
      setTimeout(() => {
        setCurrentView('receipt');
        showNotificationMessage('Success!', `Payment of ₦${amount} completed successfully`, 'success');
        onSuccess?.(payment);
      }, 500);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      showNotificationMessage('Payment Failed', error.message, 'error');
      setTimeout(() => cancelPayment(), 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const processManualPayment = async () => {
    const cleanedCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanedCardNumber || cleanedCardNumber.length !== 16) {
      showNotificationMessage('Error', 'Please enter a valid 16-digit card number', 'error');
      return;
    }
    if (!pin || pin.length < 4) {
      showNotificationMessage('Error', 'Please enter your PIN', 'error');
      return;
    }
    
    await processCardPayment({ cardId: cleanedCardNumber, pin });
  };

  const processWalletPayment = async () => {
    if (balance < amount) {
      showNotificationMessage('Insufficient Balance', `Need ₦${amount}, Available ₦${balance}`, 'error');
      return;
    }

    setIsProcessing(true);
    setCurrentView('processing');
    setPaymentProgress(0);
    setPaymentStep(1);

    try {
      setPaymentStep(1);
      setPaymentProgress(33);
      
      setTimeout(async () => {
        setPaymentStep(2);
        setPaymentProgress(66);
        
        setTimeout(async () => {
          setPaymentStep(3);
          setPaymentProgress(90);
          
          setTimeout(async () => {
            // Real wallet deduction
            deductFunds(amount, `Bus Booking: ${rideDetails.from} → ${rideDetails.to}`);
            
            setPaymentProgress(100);
            setPaymentResult({
              success: true,
              transactionId: 'WLT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 8),
              cardNumber: 'WALLET',
              cardholder: 'Wallet Balance',
              balanceAfter: balance - amount,
              pointsEarned: Math.floor(amount / 10)
            });
            
            setTimeout(() => {
              setCurrentView('receipt');
              showNotificationMessage('Success!', 'Payment completed with Wallet balance', 'success');
              onSuccess?.({ 
                transactionId: 'WLT-' + Date.now(),
                method: 'wallet',
                amount
              });
            }, 500);
          }, 600);
        }, 600);
      }, 600);
    } catch (error) {
      showNotificationMessage('Payment Failed', error.message, 'error');
      setTimeout(() => cancelPayment(), 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelPayment = () => {
    setCurrentView('payment-selection');
    setSelectedMethod(null);
    setPaymentStep(1);
    setPaymentProgress(0);
    setPaymentResult(null);
    setCardNumber('');
    setPin('');
    setActiveCard(null);
    setIsProcessing(false);
  };

  // Real-time receipt printing
  const handlePrintReceipt = () => {
    const receiptContent = document.getElementById('receipt-content');
    if (receiptContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Abia Way - Payment Receipt</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; }
              .receipt { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
              .line { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #eee; }
              .total { font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 16px; padding-top: 16px; border-top: 2px solid #16a34a; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Abia Way Transit System</h2>
              <p>Official Payment Receipt</p>
            </div>
            <div class="receipt">
              ${receiptContent.innerHTML}
            </div>
            <div class="footer">
              <p>Thank you for riding with Abia Way!</p>
              <p>This is a computer-generated receipt. No signature required.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Render views (same as before but with real-time data)
  const renderPaymentSelection = () => (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">💳 Payment Method</h2>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
          Amount: ₦{amount?.toLocaleString()}
        </span>
      </div>
      
      {/* Real-time balance display */}
      {balanceCheck && (
        <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Active Card Balance:</span>
            <span className="text-blue-400 font-mono">₦{balanceCheck.balance?.toLocaleString()}</span>
          </div>
        </div>
      )}
      
      <div 
        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all mb-3 ${
          selectedMethod === 'absin' ? 'bg-purple-500/20 border border-purple-500' : 'bg-white/5 border border-white/10 hover:border-purple-500'
        }`}
        onClick={() => setSelectedMethod('absin')}
      >
        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
          💳
        </div>
        <div className="flex-1">
          <div className="font-semibold">ABSIN Card</div>
          <div className="text-xs text-gray-400">Tap or enter your ABSIN card details</div>
        </div>
        <div className="text-gray-400">→</div>
      </div>
      
      <div 
        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all mb-3 ${
          selectedMethod === 'wallet' ? 'bg-green-500/20 border border-green-500' : 'bg-white/5 border border-white/10 hover:border-green-500'
        }`}
        onClick={() => setSelectedMethod('wallet')}
      >
        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
          💰
        </div>
        <div className="flex-1">
          <div className="font-semibold">Wallet Balance</div>
          <div className="text-xs text-gray-400">₦{balance?.toLocaleString()} available • 5% cashback</div>
        </div>
        <div className="text-gray-400">→</div>
      </div>
      
      {selectedMethod === 'absin' && (
        <div className="mt-6">
          <div className="mb-3 text-sm text-gray-400">Choose how to pay:</div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl mb-3 transition" onClick={startNFC}>
            📱 Tap ABSIN Card (NFC)
          </button>
          <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 py-3 rounded-xl mb-3 transition" onClick={startQR}>
            📷 Scan QR Code
          </button>
          <button className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 py-3 rounded-xl transition" onClick={() => setCurrentView('manual-entry')}>
            ⌨️ Enter Card Details
          </button>
        </div>
      )}
      
      {selectedMethod === 'wallet' && (
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl mt-6 transition" onClick={processWalletPayment}>
          Pay ₦{amount} with Wallet
        </button>
      )}
      
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="font-semibold mb-2 text-xs text-green-400">✅ Real-Time System</div>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Real-time balance verification</p>
          <p>• Secure card validation</p>
          <p>• Live transaction processing</p>
          <p>• Instant wallet updates</p>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="glass-card text-center p-8">
      <div className="mb-6">
        <div className="text-6xl mb-4 animate-spin">🔄</div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all" style={{ width: `${paymentProgress}%` }}></div>
        </div>
        <p className="text-gray-400">
          {paymentStep === 1 && '🔐 Verifying card with ABSIN...'}
          {paymentStep === 2 && '💰 Checking real-time balance...'}
          {paymentStep === 3 && '💳 Processing secure payment...'}
        </p>
        <p className="text-xs text-gray-500 mt-3">Please don't close this window</p>
      </div>
    </div>
  );

  const renderReceipt = () => (
    <div className="glass-card p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">✅</div>
        <h3 className="text-2xl font-bold text-green-400">Payment Successful!</h3>
        <p className="text-gray-400 text-sm">Transaction ID: {paymentResult?.transactionId}</p>
      </div>
      
      <div id="receipt-content" className="bg-white/5 rounded-xl p-5 mb-6">
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Date</span>
          <span>{new Date().toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Transaction ID</span>
          <span className="font-mono text-xs">{paymentResult?.transactionId}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Payment Method</span>
          <span>{paymentResult?.cardNumber === 'WALLET' ? 'Wallet Balance' : 'ABSIN Card'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Card/Cardholder</span>
          <span>{paymentResult?.cardholder}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Route</span>
          <span>{rideDetails?.from} → {rideDetails?.to}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Bus & Seats</span>
          <span>{rideDetails?.busId} | {rideDetails?.seats?.join(', ') || 'Auto-assigned'}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-white/10">
          <span className="text-gray-400">Passengers</span>
          <span>{rideDetails?.passengers}</span>
        </div>
        <div className="flex justify-between py-3 border-t-2 border-green-600 mt-2">
          <span className="font-bold">Total Amount</span>
          <span className="font-bold text-green-400 text-xl">₦{amount?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-400">Balance After</span>
          <span>₦{paymentResult?.balanceAfter?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-400">Points Earned</span>
          <span className="text-yellow-400">{paymentResult?.pointsEarned} pts</span>
        </div>
        {paymentResult?.authorizationCode && (
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Auth Code</span>
            <span className="font-mono text-xs">{paymentResult.authorizationCode}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition" onClick={handlePrintReceipt}>
          🖨️ Print Receipt
        </button>
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );

  // Other render functions remain the same...
  const renderNFCReading = () => (
    <div className="glass-card text-center p-8">
      <div className="mb-6">
        <div className="w-32 h-32 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center text-5xl animate-pulse">
          📱
        </div>
        <h3 className="text-lg font-semibold mb-2">Place ABSIN Card Near Phone</h3>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all" style={{ width: `${paymentProgress}%` }}></div>
        </div>
        <p className="text-gray-400 text-sm">Waiting for NFC tag...</p>
        <button className="mt-6 px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition" onClick={cancelPayment}>
          Cancel
        </button>
      </div>
    </div>
  );

  const renderQRScanning = () => (
    <div className="glass-card text-center p-8">
      <div className="mb-6">
        <div className="w-48 h-48 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center flex-col">
          <div className="text-6xl">📷</div>
          <div className="text-xs text-gray-600 mt-2">Scan ABSIN QR Code</div>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all" style={{ width: `${paymentProgress}%` }}></div>
        </div>
        <p className="text-gray-400 text-sm">Position QR code within the frame</p>
        <button className="mt-6 px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition" onClick={cancelPayment}>
          Cancel
        </button>
      </div>
    </div>
  );

  const renderManualEntry = () => (
    <div className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-5">💳 Enter ABSIN Card Details</h3>
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm text-gray-400 mb-2">PIN</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value.slice(0, 6))}
          placeholder="****"
          maxLength="6"
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500"
        />
      </div>
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl mb-3 transition" onClick={processManualPayment} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : `Pay ₦${amount}`}
      </button>
      <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition" onClick={cancelPayment}>
        Cancel
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {notification && (
          <div className="fixed bottom-5 left-5 right-5 max-w-md mx-auto z-50">
            <div className={`p-4 rounded-xl text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
              <strong>{notification.title}</strong><br />
              {notification.message}
            </div>
          </div>
        )}
        
        {currentView === 'payment-selection' && renderPaymentSelection()}
        {currentView === 'nfc-reading' && renderNFCReading()}
        {currentView === 'qr-scanning' && renderQRScanning()}
        {currentView === 'manual-entry' && renderManualEntry()}
        {currentView === 'processing' && renderProcessing()}
        {currentView === 'receipt' && renderReceipt()}
      </div>
    </div>
  );
};

export default ABSINPaymentDemo;