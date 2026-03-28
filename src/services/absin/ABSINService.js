// Main ABSIN Service - orchestrates all components
import { ABSINEncryption } from './ABSINEncryption';
import { ABSINCardReader } from './ABSINCardReader';
import { ABSINPaymentProcessor } from './ABSINPaymentProcessor';
import { mockABSINAPI } from './mockABSINAPI';

export class ABSINService {
  constructor(config = {}) {
    this.config = {
      apiBase: config.apiBase || import.meta.env.VITE_ABSIN_API_URL || 'https://api.absin.abia.gov.ng/v1',
      apiKey: config.apiKey || import.meta.env.VITE_ABSIN_API_KEY,
      merchantId: config.merchantId || import.meta.env.VITE_ABSIN_MERCHANT_ID || 'ABIA-WAY-001',
      enableNFC: config.enableNFC !== false,
      enableQR: config.enableQR !== false,
      enableMock: config.enableMock !== false, // Enable mock by default for testing
      ...config
    };
    
    this.encryption = new ABSINEncryption();
    this.cardReader = new ABSINCardReader();
    this.paymentProcessor = new ABSINPaymentProcessor(
      this.config.apiBase,
      this.config.apiKey
    );
    
    this.initialized = false;
    this.activeCard = null;
    this.sessionId = null;
    
    // Use mock API if enabled
    if (this.config.enableMock) {
      console.log('🔵 ABSIN Service: Using MOCK API for testing');
    }
  }

  async initialize() {
    try {
      // Initialize encryption
      await this.encryption.initialize(this.config.apiKey);
      
      // Initialize card reader
      const readerCapabilities = await this.cardReader.initialize();
      
      // Generate session
      this.sessionId = crypto.randomUUID();
      
      this.initialized = true;
      
      return {
        success: true,
        capabilities: readerCapabilities,
        sessionId: this.sessionId
      };
    } catch (error) {
      console.error('ABSIN initialization error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async readCard(method = 'auto') {
    if (!this.initialized) {
      await this.initialize();
    }
    
    let cardData = null;
    
    try {
      if (method === 'auto') {
        // Try NFC first, then QR
        if (this.cardReader.isNFCSupported) {
          try {
            cardData = await this.cardReader.readWithNFC();
          } catch {
            cardData = null;
          }
        }
        
        if (!cardData && this.cardReader.isQRSupported) {
          cardData = await this.cardReader.readWithQR();
        }
      } else if (method === 'nfc') {
        cardData = await this.cardReader.readWithNFC();
      } else if (method === 'qr') {
        cardData = await this.cardReader.readWithQR();
      }
      
      if (!cardData || !cardData.cardId) {
        throw new Error('Failed to read card');
      }
      
      // Validate card
      const validatedCard = await this.paymentProcessor.validateCard(cardData);
      
      this.activeCard = {
        ...cardData,
        ...validatedCard,
        readAt: new Date().toISOString()
      };
      
      return this.activeCard;
    } catch (error) {
      console.error('Card read error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async manualCardEntry(cardNumber, pin) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    try {
      // Hash PIN for security
      const hashedPin = await this.encryption.hashData(pin);
      
      const cardData = {
        cardId: cardNumber,
        pin: hashedPin,
        method: 'manual',
        timestamp: new Date().toISOString()
      };
      
      const validatedCard = await this.paymentProcessor.validateCard(cardData);
      
      this.activeCard = {
        ...cardData,
        ...validatedCard,
        readAt: new Date().toISOString()
      };
      
      return this.activeCard;
    } catch (error) {
      console.error('Manual entry error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processPayment(amount, rideDetails) {
    if (!this.activeCard) {
      throw new Error('No active card. Please tap/enter card first.');
    }
    
    try {
      if (this.config.enableMock) {
        // Use mock API for testing
        console.log('🔵 Using mock API for payment processing');
        
        const balance = await mockABSINAPI.checkBalance(this.activeCard.cardId);
        
        if (!balance.success || balance.data.balance < amount) {
          return {
            success: false,
            error: 'Insufficient balance',
            balance: balance.data?.balance || 0,
            required: amount
          };
        }
        
        const payment = await mockABSINAPI.initiatePayment(
          this.activeCard.cardId,
          amount,
          rideDetails
        );
        
        if (!payment.success) {
          throw new Error(payment.message || 'Payment initiation failed');
        }
        
        const confirmed = await mockABSINAPI.confirmPayment(payment.data.transactionId);
        
        if (!confirmed.success) {
          throw new Error(confirmed.message || 'Payment confirmation failed');
        }
        
        const receipt = this.generateReceipt(payment.data, rideDetails, balance.data);
        
        return {
          success: true,
          transactionId: payment.data.transactionId,
          receipt,
          balance: balance.data.balance - amount,
          pointsEarned: Math.floor(amount / 10)
        };
      } else {
        // Use real API
        console.log('🔵 Using real API for payment processing');
        
        // Check balance
        const balance = await this.paymentProcessor.checkBalance(this.activeCard.cardId);
        
        if (balance.balance < amount) {
          return {
            success: false,
            error: 'Insufficient balance',
            balance: balance.balance,
            required: amount
          };
        }
        
        // Initiate payment
        const payment = await this.paymentProcessor.initiatePayment(
          this.activeCard.cardId,
          amount,
          rideDetails
        );
        
        // Confirm payment (no OTP for demo, would require OTP in production)
        const confirmed = await this.paymentProcessor.confirmPayment(payment.transactionId);
        
        if (!confirmed.success) {
          throw new Error(confirmed.message || 'Payment confirmation failed');
        }
        
        // Generate receipt
        const receipt = this.generateReceipt(payment, rideDetails, balance);
        
        return {
          success: true,
          transactionId: payment.transactionId,
          receipt,
          balance: balance.balance - amount,
          pointsEarned: Math.floor(amount / 10)
        };
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateReceipt(payment, rideDetails, balance) {
    return {
      receiptId: `RCP-${(payment.transactionId || Date.now()).slice(-8)}`,
      date: new Date().toISOString(),
      merchant: this.config.merchantName || 'Abia Way Transit System',
      merchantId: this.config.merchantId,
      cardNumber: `****${this.activeCard?.cardId?.slice(-4) || '0000'}`,
      cardholder: this.activeCard?.cardholderName || this.activeCard?.cardholder?.name || 'ABSIN Cardholder',
      amount: payment.amount,
      currency: 'NGN',
      route: `${rideDetails.from} → ${rideDetails.to}`,
      busId: rideDetails.busId,
      seats: rideDetails.seats || [],
      passengers: rideDetails.passengers,
      distance: rideDetails.distance || '18.5 km',
      duration: rideDetails.duration || '25 mins',
      balanceBefore: balance.balance,
      balanceAfter: balance.balance - payment.amount,
      pointsEarned: Math.floor(payment.amount / 10),
      transactionId: payment.transactionId,
      authorizationCode: payment.authorizationCode,
      timestamp: new Date().toISOString()
    };
  }

  async getTransactionHistory(limit = 20, offset = 0) {
    if (this.config.enableMock) {
      // Return mock transaction history
      return {
        success: true,
        data: {
          transactions: [
            {
              id: 'TXN-001',
              amount: 350,
              description: 'Bus Ride: Umuahia → Aba',
              date: new Date().toISOString(),
              status: 'completed'
            },
            {
              id: 'TXN-002',
              amount: 700,
              description: 'Bus Ride: Aba → Umuahia (2 passengers)',
              date: new Date(Date.now() - 86400000).toISOString(),
              status: 'completed'
            }
          ],
          total: 2
        }
      };
    }
    
    const response = await fetch(`${this.config.apiBase}/transactions/${this.activeCard?.cardId}?limit=${limit}&offset=${offset}`, {
      headers: {
        'X-API-Key': this.config.apiKey,
        'X-Session-ID': this.sessionId
      }
    });
    
    return await response.json();
  }

  async getCardPoints() {
    if (!this.activeCard) {
      throw new Error('No active card');
    }
    
    if (this.config.enableMock) {
      // Return mock points data
      return {
        success: true,
        data: {
          total: this.activeCard.points || 450,
          nextTier: 600,
          tier: this.activeCard.tier || 'premium'
        }
      };
    }
    
    const response = await fetch(`${this.config.apiBase}/card/points/${this.activeCard.cardId}`, {
      headers: {
        'X-API-Key': this.config.apiKey
      }
    });
    
    const result = await response.json();
    
    return result.data;
  }

  async blockCard(reason) {
    if (!this.activeCard) {
      throw new Error('No active card');
    }
    
    if (this.config.enableMock) {
      return {
        success: true,
        message: 'Card blocked successfully',
        data: {
          cardId: this.activeCard.cardId,
          status: 'blocked',
          reason,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    const response = await fetch(`${this.config.apiBase}/card/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey
      },
      body: JSON.stringify({
        cardId: this.activeCard.cardId,
        reason,
        timestamp: new Date().toISOString()
      })
    });
    
    return await response.json();
  }

  clearActiveCard() {
    this.activeCard = null;
    return true;
  }
}

// Export singleton instance
let absinInstance = null;

export const getABSINService = () => {
  if (!absinInstance) {
    absinInstance = new ABSINService();
  }
  return absinInstance;
};