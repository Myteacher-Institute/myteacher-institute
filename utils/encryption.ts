// Simple encryption utility for URL parameters
// Uses a combination of base64 and XOR cipher for obfuscation

const SECRET_KEY = (process.env.ENCRYPTION_SECRET_KEY as string) || 'myteacher-institute-secret-key-2024';

// Simple XOR cipher with base64 encoding
export const encrypt = (text: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return btoa(result);
};

// Decrypt the encrypted text
export const decrypt = (encrypted: string): string => {
  try {
    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return result;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};

// URL-safe base64 encoding
export const encryptForUrl = (text: string): string => {
  const encrypted = encrypt(text);
  return encrypted
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// URL-safe base64 decoding
export const decryptFromUrl = (encrypted: string): string => {
  const padded = encrypted + '='.repeat((4 - encrypted.length % 4) % 4);
  const urlSafe = padded.replace(/-/g, '+').replace(/_/g, '/');
  return decrypt(urlSafe);
};
