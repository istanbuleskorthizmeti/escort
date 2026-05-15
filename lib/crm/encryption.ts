import crypto from 'node:crypto';

const ENCRYPTION_KEY = process.env.CRM_ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

// 32-Byte key garanti etmek için SHA-256 kullanılır.
const getEncryptionKey = () => {
  if (!ENCRYPTION_KEY) {
    throw new Error('CRM_ENCRYPTION_KEY is required for encryption operations');
  }
  return crypto.createHash('sha256').update(String(ENCRYPTION_KEY)).digest();
};

/**
 * DRKCNAY ENCRYPTION PROTOCOL
 * Encrypts sensitive CRM data with AES-256-GCM.
 */
export function encrypt(text: string): string {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encryptedData
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * DRKCNAY DECRYPTION PROTOCOL
 * Decrypts sensitive CRM data.
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return encryptedData;
  
  try {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '[DECRYPTION_ERROR]';
  }
}
