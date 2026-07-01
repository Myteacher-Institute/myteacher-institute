// Environment Variables Configuration
export const ENV_CONFIG = {
  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  
  // App Configuration
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Myteacher Institute',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_MOCK_API: process.env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
  NEXT_PUBLIC_ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  
  // Storage Configuration
  NEXT_PUBLIC_ENABLE_INDEXED_DB: process.env.NEXT_PUBLIC_ENABLE_INDEXED_DB !== 'false',
  NEXT_PUBLIC_INDEXED_DB_NAME: process.env.NEXT_PUBLIC_INDEXED_DB_NAME || 'MyteacherDB',
  NEXT_PUBLIC_INDEXED_DB_VERSION: parseInt(process.env.NEXT_PUBLIC_INDEXED_DB_VERSION || '1'),
  
  // Cookie Configuration
  NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME: process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
  
  // Session Configuration
  NEXT_PUBLIC_SESSION_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '900000'), // 15 minutes
  NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD: parseInt(process.env.NEXT_PUBLIC_TOKEN_REFRESH_THRESHOLD || '300000'), // 5 minutes
} as const;

// Type-safe environment variable access
export const getEnv = () => ENV_CONFIG;

// Validate environment variables
export const validateEnv = () => {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
};