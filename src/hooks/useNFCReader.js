import { useState, useEffect, useCallback } from 'react';

export const useNFCReader = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for NFC support
    if ('NDEFReader' in window) {
      setIsSupported(true);
    }
  }, []);

  const startReading = useCallback(async () => {
    if (!isSupported) {
      setError('NFC not supported');
      return;
    }

    setIsReading(true);
    setError(null);
    setCardData(null);

    try {
      const nfc = new NDEFReader();
      await nfc.scan();
      
      nfc.addEventListener('readingerror', () => {
        setError('Failed to read NFC tag');
        setIsReading(false);
      });
      
      nfc.addEventListener('reading', (event) => {
        const decoder = new TextDecoder();
        let data = '';
        
        for (const record of event.message.records) {
          if (record.recordType === 'text') {
            data += decoder.decode(record.data);
          }
        }
        
        // Parse ABSIN card data
        const parts = data.split('|');
        setCardData({
          cardId: parts[0],
          userId: parts[1],
          balance: parseFloat(parts[2]),
          timestamp: parts[3],
          signature: parts[4]
        });
        
        setIsReading(false);
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (isReading) {
          setError('Timeout waiting for card');
          setIsReading(false);
        }
      }, 30000);
    } catch (err) {
      setError(err.message);
      setIsReading(false);
    }
  }, [isSupported, isReading]);

  const stopReading = useCallback(() => {
    setIsReading(false);
    setError(null);
  }, []);

  return {
    isSupported,
    isReading,
    cardData,
    error,
    startReading,
    stopReading
  };
};