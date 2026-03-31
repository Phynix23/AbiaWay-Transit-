import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { useNotification } from '../../contexts/NotificationContext';

// ==================== PAYMENT SERVICES ====================

const CardPaymentService = {
  async validateCard(cardDetails) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const validCards = {
      '4111111111111111': { type: 'visa', balance: 25000, holder: 'ABUOMA DAVID' },
      '5111111111111111': { type: 'mastercard', balance: 45000, holder: 'ABUOMA DAVID' },
      '5061111111111111': { type: 'verve', balance: 15000, holder: 'ABUOMA DAVID' }
    };
    
    const cardNum = cardDetails.number?.replace(/\s/g, '') || '';
    const card = validCards[cardNum];
    
    if (!card) {
      return { success: false, message: 'Invalid card number' };
    }
    
    return {
      success: true,
      data: {
        type: card.type,
        holder: card.holder,
        balance: card.balance,
        lastFour: cardNum.slice(-4)
      }
    };
  },
  
  async processPayment(cardDetails, amount) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const cardNum = cardDetails.number?.replace(/\s/g, '') || '';
    const validCards = {
      '4111111111111111': { balance: 25000 },
      '5111111111111111': { balance: 45000 },
      '5061111111111111': { balance: 15000 }
    };
    
    const card = validCards[cardNum];
    const totalAmount = amount + 50;
    
    if (!card || card.balance < totalAmount) {
      return { success: false, message: 'Insufficient funds on card' };
    }
    
    card.balance -= totalAmount;
    
    return {
      success: true,
      transactionId: `CARD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      amount: amount,
      fee: 50,
      total: totalAmount,
      cardType: cardNum.startsWith('4') ? 'Visa' : cardNum.startsWith('5') ? 'Mastercard' : 'Verve',
      lastFour: cardNum.slice(-4),
      balanceAfter: card.balance,
      authorizationCode: `AUTH-${Math.random().toString(36).substr(2, 8)}`
    };
  },
  
  async checkBalance(cardNumber) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const validCards = {
      '4111111111111111': { balance: 25000, type: 'visa' },
      '5111111111111111': { balance: 45000, type: 'mastercard' },
      '5061111111111111': { balance: 15000, type: 'verve' }
    };
    
    const cardNum = cardNumber?.replace(/\s/g, '') || '';
    const card = validCards[cardNum];
    
    if (!card) {
      return { success: false, message: 'Card not found' };
    }
    
    return {
      success: true,
      balance: card.balance,
      cardType: card.type,
      lastFour: cardNum.slice(-4)
    };
  }
};

const USSDPaymentService = {
  banks: {
    'GTB': { name: 'Guaranty Trust Bank', code: '*737#', color: 'orange' },
    'UBA': { name: 'United Bank for Africa', code: '*919#', color: 'red' },
    'FBN': { name: 'First Bank of Nigeria', code: '*894#', color: 'blue' },
    'ACCESS': { name: 'Access Bank', code: '*901#', color: 'green' },
    'ZENITH': { name: 'Zenith Bank', code: '*966#', color: 'blue' }
  },
  
  async initiatePayment(bankCode, phoneNumber, amount) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const bank = this.banks[bankCode];
    if (!bank) {
      return { success: false, message: 'Invalid bank selection' };
    }
    
    if (!phoneNumber || phoneNumber.length !== 11) {
      return { success: false, message: 'Invalid phone number' };
    }
    
    const ussdCode = `${bank.code}${amount}#`;
    const reference = `USSD-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    return {
      success: true,
      ussdCode,
      bankName: bank.name,
      reference,
      amount,
      fee: 30,
      total: amount + 30,
      instructions: `Dial ${ussdCode} from ${phoneNumber} to complete payment`
    };
  },
  
  async confirmPayment(reference) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    return { success: true, confirmed: true };
  }
};

const TransferPaymentService = {
  async generateReference(amount) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const reference = `TRF-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    
    return {
      success: true,
      reference,
      expiresAt,
      accountDetails: {
        bankName: 'Guaranty Trust Bank (GTBank)',
        accountName: 'Abia Way Transit System',
        accountNumber: '0123456789',
        sortCode: '058-123-456',
        amount: amount,
        narration: `Wallet Funding - Reference: ${reference}`
      }
    };
  },
  
  async confirmTransfer(reference) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    return { success: true, confirmed: true };
  }
};

const ABSINPaymentService = {
  async validateCard(cardNumber, pin) {
    await new Promise(resolve => setTimeout(resolve, 800));
    const validCards = {
      '1234567890123456': { holder: 'Abuoma David', balance: 12450, tier: 'Premium' },
      '1111222233334444': { holder: 'Chidi Okonkwo', balance: 5000, tier: 'Standard' },
      '5555666677778888': { holder: 'Ngozi Eze', balance: 25000, tier: 'Platinum' }
    };
    
    const card = validCards[cardNumber?.replace(/\s/g, '')];
    if (!card || pin !== '1234') {
      return { success: false, message: 'Invalid card or PIN' };
    }
    
    return { success: true, data: card };
  },
  
  async processPayment(cardNumber, amount) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const validCards = {
      '1234567890123456': { balance: 12450 },
      '1111222233334444': { balance: 5000 },
      '5555666677778888': { balance: 25000 }
    };
    
    const card = validCards[cardNumber?.replace(/\s/g, '')];
    const totalAmount = amount + 50;
    
    if (!card || card.balance < totalAmount) {
      return { success: false, message: 'Insufficient balance' };
    }
    
    card.balance -= totalAmount;
    
    return {
      success: true,
      transactionId: `ABSIN-${Date.now()}`,
      amount: amount,
      fee: 50,
      total: totalAmount,
      balanceAfter: card.balance,
      pointsEarned: Math.floor(amount / 10)
    };
  }
};

const PaymentMethodModal = ({ isOpen, onClose, onSuccess }) => {
  const [currentView, setCurrentView] = useState('select');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  // Card Payment State
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    holder: ''
  });
  const [cardBalance, setCardBalance] = useState(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  
  // USSD Payment State
  const [ussdDetails, setUssdDetails] = useState({
    bank: '',
    phone: ''
  });
  const [ussdResponse, setUssdResponse] = useState(null);
  
  // Transfer Payment State
  const [transferDetails, setTransferDetails] = useState(null);
  
  // ABSIN Card State
  const [absinCard, setAbsinCard] = useState({ number: '', pin: '' });
  
  const { balance, addFunds, refreshBalance } = useWallet();
  const { showNotification } = useNotification();

  if (!isOpen) return null;

  // RESET ALL STATES for specific payment method
  const selectPaymentMethod = (methodId) => {
    // Reset ALL states
    setAmount('');
    setIsProcessing(false);
    setProcessingMessage('');
    
    // Reset Card state
    setCardDetails({ number: '', expiry: '', cvv: '', holder: '' });
    setCardBalance(null);
    setCheckingBalance(false);
    
    // Reset USSD state
    setUssdDetails({ bank: '', phone: '' });
    setUssdResponse(null);
    
    // Reset Transfer state
    setTransferDetails(null);
    
    // Reset ABSIN state
    setAbsinCard({ number: '', pin: '' });
    
    // Set the view to the selected payment method
    setCurrentView(methodId);
  };

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Card Payment', 
      icon: 'credit-card', 
      description: 'Visa, Mastercard, Verve',
      color: 'blue',
      fee: 50,
      minAmount: 100,
      maxAmount: 500000
    },
    { 
      id: 'ussd', 
      name: 'USSD Payment', 
      icon: 'smartphone', 
      description: 'Quick banking via USSD',
      color: 'green',
      fee: 30,
      minAmount: 100,
      maxAmount: 200000
    },
    { 
      id: 'transfer', 
      name: 'Bank Transfer', 
      icon: 'banknote', 
      description: 'Direct bank transfer',
      color: 'purple',
      fee: 0,
      minAmount: 500,
      maxAmount: 1000000
    },
    { 
      id: 'absin', 
      name: 'ABSIN Card', 
      icon: 'credit-card', 
      description: 'Abia State Integrated Network',
      color: 'orange',
      fee: 50,
      minAmount: 50,
      maxAmount: 1000000
    }
  ];

  const banks = [
    { code: 'GTB', name: 'Guaranty Trust Bank', ussdCode: '*737#' },
    { code: 'UBA', name: 'United Bank for Africa', ussdCode: '*919#' },
    { code: 'FBN', name: 'First Bank of Nigeria', ussdCode: '*894#' },
    { code: 'ACCESS', name: 'Access Bank', ussdCode: '*901#' },
    { code: 'ZENITH', name: 'Zenith Bank', ussdCode: '*966#' }
  ];

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16));
    setCardDetails({ ...cardDetails, number: formatted });
  };

  // ==================== CARD PAYMENT ====================
  
  const handleCheckCardBalance = async () => {
    const cardNum = cardDetails.number.replace(/\s/g, '');
    if (!cardNum || cardNum.length !== 16) {
      showNotification('Error', 'Please enter a valid 16-digit card number', 'error');
      return;
    }
    
    setCheckingBalance(true);
    const result = await CardPaymentService.checkBalance(cardNum);
    
    if (result.success) {
      setCardBalance(result);
      showNotification('Balance Check', `Available: ₦${result.balance.toLocaleString()}`, 'success');
    } else {
      showNotification('Error', result.message, 'error');
    }
    setCheckingBalance(false);
  };

  const handleCardPayment = async () => {
    const amountNum = parseInt(amount);
    const cardNum = cardDetails.number.replace(/\s/g, '');
    
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification('Error', 'Please enter a valid amount', 'error');
      return;
    }
    
    if (amountNum < 100) {
      showNotification('Error', 'Minimum amount is ₦100', 'error');
      return;
    }
    
    if (!cardNum || cardNum.length !== 16) {
      showNotification('Error', 'Please enter a valid 16-digit card number', 'error');
      return;
    }
    
    if (!cardDetails.expiry || cardDetails.expiry.length !== 5) {
      showNotification('Error', 'Please enter expiry date (MM/YY)', 'error');
      return;
    }
    
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      showNotification('Error', 'Please enter CVV', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage('Validating card...');
    
    const validation = await CardPaymentService.validateCard(cardDetails);
    if (!validation.success) {
      showNotification('Error', validation.message, 'error');
      setIsProcessing(false);
      return;
    }
    
    setProcessingMessage('Processing payment...');
    const result = await CardPaymentService.processPayment(cardDetails, amountNum);
    
    if (result.success) {
      addFunds(amountNum);
      await refreshBalance();
      showNotification('Payment Successful', `₦${amountNum.toLocaleString()} added to wallet!`, 'success');
      onSuccess?.();
      setTimeout(() => onClose(), 2000);
    } else {
      showNotification('Payment Failed', result.message, 'error');
    }
    
    setIsProcessing(false);
  };

  // ==================== USSD PAYMENT ====================
  
  const handleUSSDPayment = async () => {
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification('Error', 'Please enter a valid amount', 'error');
      return;
    }
    
    if (amountNum < 100) {
      showNotification('Error', 'Minimum amount is ₦100', 'error');
      return;
    }
    
    if (!ussdDetails.bank) {
      showNotification('Error', 'Please select your bank', 'error');
      return;
    }
    
    if (!ussdDetails.phone || ussdDetails.phone.length !== 11) {
      showNotification('Error', 'Please enter valid 11-digit phone number', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage('Generating USSD code...');
    
    const result = await USSDPaymentService.initiatePayment(ussdDetails.bank, ussdDetails.phone, amountNum);
    
    if (result.success) {
      setUssdResponse(result);
      showNotification(
        'USSD Instructions', 
        `📱 Dial ${result.ussdCode} from ${ussdDetails.phone}\n\n💰 Amount: ₦${amountNum.toLocaleString()}\n📋 Reference: ${result.reference}`,
        'info'
      );
      
      setProcessingMessage('Waiting for USSD confirmation...');
      
      setTimeout(async () => {
        const confirmed = await USSDPaymentService.confirmPayment(result.reference);
        if (confirmed.success) {
          addFunds(amountNum);
          await refreshBalance();
          showNotification('Payment Successful', `₦${amountNum.toLocaleString()} added to wallet!`, 'success');
          onSuccess?.();
          onClose();
        }
      }, 5000);
    } else {
      showNotification('Error', result.message, 'error');
      setIsProcessing(false);
    }
  };

  // ==================== BANK TRANSFER ====================
  
  const handleBankTransfer = async () => {
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification('Error', 'Please enter a valid amount', 'error');
      return;
    }
    
    if (amountNum < 500) {
      showNotification('Error', 'Minimum amount is ₦500', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage('Generating transfer details...');
    
    const result = await TransferPaymentService.generateReference(amountNum);
    
    if (result.success) {
      setTransferDetails(result);
      
      const message = `🏦 Transfer ₦${amountNum.toLocaleString()} to:\n\n` +
        `Bank: ${result.accountDetails.bankName}\n` +
        `Account: ${result.accountDetails.accountNumber}\n` +
        `Name: ${result.accountDetails.accountName}\n` +
        `Reference: ${result.reference}\n\n` +
        `⏰ Expires: ${new Date(result.expiresAt).toLocaleTimeString()}`;
      
      showNotification('Transfer Instructions', message, 'info');
      
      setProcessingMessage('Waiting for transfer confirmation...');
      
      setTimeout(async () => {
        const confirmed = await TransferPaymentService.confirmTransfer(result.reference);
        if (confirmed.success) {
          addFunds(amountNum);
          await refreshBalance();
          showNotification('Payment Successful', `₦${amountNum.toLocaleString()} added to wallet!`, 'success');
          onSuccess?.();
          onClose();
        }
      }, 10000);
    } else {
      showNotification('Error', result.message, 'error');
      setIsProcessing(false);
    }
  };

  // ==================== ABSIN PAYMENT ====================
  
  const handleABSINPayment = async () => {
    const amountNum = parseInt(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification('Error', 'Please enter a valid amount', 'error');
      return;
    }
    
    if (amountNum < 50) {
      showNotification('Error', 'Minimum amount is ₦50', 'error');
      return;
    }
    
    if (!absinCard.number || absinCard.number.replace(/\s/g, '').length !== 16) {
      showNotification('Error', 'Please enter a valid 16-digit ABSIN card number', 'error');
      return;
    }
    
    if (!absinCard.pin || absinCard.pin.length !== 4) {
      showNotification('Error', 'Please enter your 4-digit PIN', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage('Validating ABSIN card...');
    
    const validation = await ABSINPaymentService.validateCard(absinCard.number, absinCard.pin);
    if (!validation.success) {
      showNotification('Error', validation.message, 'error');
      setIsProcessing(false);
      return;
    }
    
    setProcessingMessage('Processing payment...');
    const result = await ABSINPaymentService.processPayment(absinCard.number, amountNum);
    
    if (result.success) {
      addFunds(amountNum);
      await refreshBalance();
      showNotification('Payment Successful', `₦${amountNum.toLocaleString()} added to wallet!`, 'success');
      showNotification('Points Earned', `You earned ${result.pointsEarned} loyalty points!`, 'success');
      onSuccess?.();
      setTimeout(() => onClose(), 2000);
    } else {
      showNotification('Payment Failed', result.message, 'error');
    }
    
    setIsProcessing(false);
  };

  // ==================== RENDER METHODS ====================

  const renderSelectMethod = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Add Funds to Wallet</h3>
      <p className="text-sm text-gray-400 mb-4">
        Current Balance: <span className="text-green-400 font-bold">₦{balance?.toLocaleString() || 0}</span>
      </p>
      
      <div className="grid gap-3">
        {paymentMethods.map(pm => (
          <button
            key={pm.id}
            className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary transition-all group"
            onClick={() => selectPaymentMethod(pm.id)}
          >
            <div className={`w-12 h-12 rounded-full bg-${pm.color}-500/20 flex items-center justify-center`}>
              <i data-lucide={pm.icon} className={`w-6 h-6 text-${pm.color}-400`}></i>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold">{pm.name}</p>
              <p className="text-xs text-gray-400">{pm.description}</p>
              <div className="flex gap-3 mt-1 text-xs">
                <span className="text-gray-500">Fee: ₦{pm.fee}</span>
                <span className="text-gray-500">Min: ₦{pm.minAmount}</span>
              </div>
            </div>
            <i data-lucide="chevron-right" className="w-5 h-5 text-gray-400"></i>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentView('select')} className="text-gray-400 hover:text-white">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h3 className="text-xl font-bold">💳 Card Payment</h3>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-3"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Fee: ₦50 • Min: ₦100 • Max: ₦500,000</p>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Card Number</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cardDetails.number}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3"
          />
          <button
            onClick={handleCheckCardBalance}
            disabled={checkingBalance}
            className="px-4 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            <i data-lucide="eye" className="w-5 h-5"></i>
          </button>
        </div>
      </div>
      
      {cardBalance && (
        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
          <div className="flex justify-between">
            <span>Available Balance:</span>
            <span className="font-bold text-green-400">₦{cardBalance.balance.toLocaleString()}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {cardBalance.cardType?.toUpperCase()} • Last 4: {cardBalance.lastFour}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Expiry (MM/YY)</label>
          <input
            type="text"
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            placeholder="12/28"
            maxLength="5"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">CVV</label>
          <input
            type="password"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            placeholder="123"
            maxLength="4"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Cardholder Name</label>
        <input
          type="text"
          value={cardDetails.holder}
          onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value.toUpperCase() })}
          placeholder="ABUOMA DAVID"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
        />
      </div>
      
      <div className="p-3 bg-yellow-500/10 rounded-lg">
        <div className="flex justify-between">
          <span>Amount to Pay:</span>
          <span className="font-bold">₦{parseInt(amount) || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing Fee:</span>
          <span className="text-yellow-400">₦50</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-white/10 mt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-primary">₦{(parseInt(amount) || 0) + 50}</span>
        </div>
      </div>
      
      <button
        className="w-full btn-primary py-3 rounded-lg"
        onClick={handleCardPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ₦${parseInt(amount) || 0}`}
      </button>
    </div>
  );

  const renderUSSDForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentView('select')} className="text-gray-400 hover:text-white">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h3 className="text-xl font-bold">📱 USSD Payment</h3>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-3"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Fee: ₦30 • Min: ₦100 • Max: ₦200,000</p>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Select Bank</label>
        <select
          value={ussdDetails.bank}
          onChange={(e) => setUssdDetails({ ...ussdDetails, bank: e.target.value })}
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
        >
          <option value="">Select Bank</option>
          {banks.map(bank => (
            <option key={bank.code} value={bank.code}>{bank.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Phone Number (Registered with Bank)</label>
        <input
          type="tel"
          value={ussdDetails.phone}
          onChange={(e) => setUssdDetails({ ...ussdDetails, phone: e.target.value })}
          placeholder="08012345678"
          maxLength="11"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
        />
      </div>
      
      <div className="p-3 bg-yellow-500/10 rounded-lg">
        <div className="flex justify-between">
          <span>Amount to Pay:</span>
          <span className="font-bold">₦{parseInt(amount) || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing Fee:</span>
          <span className="text-yellow-400">₦30</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-white/10 mt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-primary">₦{(parseInt(amount) || 0) + 30}</span>
        </div>
      </div>
      
      {ussdResponse && (
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <p className="text-sm font-semibold mb-2">📱 USSD Code Generated:</p>
          <p className="text-lg font-mono text-center bg-black/30 p-2 rounded">{ussdResponse.ussdCode}</p>
          <p className="text-xs text-gray-400 mt-2">Reference: {ussdResponse.reference}</p>
        </div>
      )}
      
      <button
        className="w-full btn-primary py-3 rounded-lg"
        onClick={handleUSSDPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Generating USSD...' : 'Generate USSD Code'}
      </button>
    </div>
  );

  const renderTransferForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentView('select')} className="text-gray-400 hover:text-white">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h3 className="text-xl font-bold">💰 Bank Transfer</h3>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-3"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">No Fee • Min: ₦500 • Max: ₦1,000,000</p>
      </div>
      
      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
        <p className="text-sm font-semibold mb-3">🏦 Account Details:</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Bank:</span>
            <span className="font-mono">Guaranty Trust Bank (GTBank)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Account Name:</span>
            <span>Abia Way Transit System</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Account Number:</span>
            <span className="font-mono text-lg">0123456789</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Sort Code:</span>
            <span>058-123-456</span>
          </div>
        </div>
      </div>
      
      {transferDetails && (
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <p className="text-sm font-semibold mb-2">📋 Transfer Reference:</p>
          <p className="text-sm font-mono text-center bg-black/30 p-2 rounded">{transferDetails.reference}</p>
          <p className="text-xs text-gray-400 mt-2">Expires: {new Date(transferDetails.expiresAt).toLocaleTimeString()}</p>
        </div>
      )}
      
      <div className="p-3 bg-yellow-500/10 rounded-lg">
        <div className="flex justify-between">
          <span>Amount to Transfer:</span>
          <span className="font-bold text-primary">₦{parseInt(amount) || 0}</span>
        </div>
      </div>
      
      <button
        className="w-full btn-primary py-3 rounded-lg"
        onClick={handleBankTransfer}
        disabled={isProcessing}
      >
        {isProcessing ? 'Generating Reference...' : 'Generate Transfer Reference'}
      </button>
    </div>
  );

  const renderABSINForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setCurrentView('select')} className="text-gray-400 hover:text-white">
          <i data-lucide="arrow-left" className="w-5 h-5"></i>
        </button>
        <h3 className="text-xl font-bold">🔗 ABSIN Card Payment</h3>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-8 pr-4 py-3"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Fee: ₦50 • Min: ₦50 • Max: ₦1,000,000</p>
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">ABSIN Card Number</label>
        <input
          type="text"
          value={absinCard.number}
          onChange={(e) => {
            const formatted = e.target.value.replace(/\s/g, '').slice(0, 16);
            const groups = formatted.match(/.{1,4}/g);
            setAbsinCard({ ...absinCard, number: groups ? groups.join(' ') : formatted });
          }}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">PIN</label>
        <input
          type="password"
          value={absinCard.pin}
          onChange={(e) => setAbsinCard({ ...absinCard, pin: e.target.value.slice(0, 4) })}
          placeholder="****"
          maxLength="4"
          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3"
        />
      </div>
      
      <div className="p-3 bg-yellow-500/10 rounded-lg">
        <div className="flex justify-between">
          <span>Amount to Pay:</span>
          <span className="font-bold">₦{parseInt(amount) || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing Fee:</span>
          <span className="text-yellow-400">₦50</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-white/10 mt-2">
          <span className="font-bold">Total:</span>
          <span className="font-bold text-primary">₦{(parseInt(amount) || 0) + 50}</span>
        </div>
      </div>
      
      <div className="p-3 bg-purple-500/10 rounded-lg">
        <p className="text-xs text-purple-400">✨ You'll earn {Math.floor((parseInt(amount) || 0) / 10)} loyalty points on this transaction!</p>
      </div>
      
      <button
        className="w-full btn-primary py-3 rounded-lg"
        onClick={handleABSINPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay ₦${parseInt(amount) || 0}`}
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">{processingMessage || 'Processing your payment...'}</p>
      <p className="text-xs text-gray-500 mt-2">Please don't close this window</p>
    </div>
  );

  // Main render
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="glass-card p-6">
          {currentView === 'select' && renderSelectMethod()}
          {currentView === 'card' && renderCardForm()}
          {currentView === 'ussd' && renderUSSDForm()}
          {currentView === 'transfer' && renderTransferForm()}
          {currentView === 'absin' && renderABSINForm()}
          {currentView === 'processing' && renderProcessing()}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;