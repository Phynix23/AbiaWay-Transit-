// Encryption service for sensitive card data
export class ABSINEncryption {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keySize = 256;
    this.key = null;
  }

  async initialize(secretKey) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    
    this.key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: this.algorithm },
      false,
      ['encrypt', 'decrypt']
    );
    
    return this.key !== null;
  }

  async encrypt(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      this.key,
      encodedData
    );
    
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  }

  async decrypt(encryptedData) {
    const iv = new Uint8Array(encryptedData.iv);
    const data = new Uint8Array(encryptedData.data);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      this.key,
      data
    );
    
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decrypted));
  }

  async hashData(data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    const hash = await crypto.subtle.digest('SHA-256', encodedData);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  generateHMAC(data, secret) {
    const encoder = new TextEncoder();
    return crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    ).then(key => {
      return crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(JSON.stringify(data))
      );
    }).then(signature => {
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    });
  }
}