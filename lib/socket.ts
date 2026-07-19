import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 2000; // Start with 2 seconds
let tokenRefreshAttempts = 0;
const MAX_TOKEN_REFRESH_ATTEMPTS = 3;
let isServerAvailable = true;
let lastServerCheck = 0;
const SERVER_CHECK_INTERVAL = 30000; // Check server availability every 30 seconds

const checkServerAvailability = async (): Promise<boolean> => {
  const now = Date.now();
  // Cache the server availability check result
  if (now - lastServerCheck < SERVER_CHECK_INTERVAL && !isServerAvailable) {
    return isServerAvailable;
  }
  
  lastServerCheck = now;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    isServerAvailable = response.ok;
    if (!isServerAvailable) {
      console.log('Socket: Server health check failed');
    } else {
      console.log('Socket: Server health check passed');
    }
    return isServerAvailable;
  } catch (error) {
    console.log('Socket: Server health check error, assuming unavailable:', error);
    isServerAvailable = false;
    return false;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    // First check if server is available
    const serverAvailable = await checkServerAvailability();
    if (!serverAvailable) {
      console.log('Socket: Server not available, skipping token refresh');
      return null;
    }
    
    console.log('Socket: Attempting to refresh access token...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout for token refresh
    
    const response = await fetch(`${BACKEND_URL}/api/auth/new-access-code`, {
      method: 'GET',
      credentials: 'include',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.accessToken) {
        console.log('Socket: Token refreshed successfully');
        // Update cookie
        document.cookie = `accessToken=${data.accessToken}; path=/; max-age=86400; SameSite=lax`;
        tokenRefreshAttempts = 0;
        return data.accessToken;
      }
    }
    console.error('Socket: Token refresh failed - no access token in response');
    return null;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('Socket: Token refresh timed out');
    } else {
      console.error('Socket: Failed to refresh access token:', error);
    }
    return null;
  }
};

const validateToken = (token: string): boolean => {
  if (!token || token.length < 50) {
    console.log('Socket: Invalid token format or length');
    return false;
  }
  
  try {
    // Check if token is a valid JWT format (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Socket: Invalid JWT format');
      return false;
    }
    
    // Decode and check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    
    if (payload.exp && payload.exp < now) {
      console.log('Socket: Token is expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Socket: Token validation failed:', error);
    return false;
  }
};

export const initializeSocket = (token: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  // Validate token before attempting connection
  if (!validateToken(token)) {
    console.log('Socket: Invalid token provided, will attempt refresh on connection error');
  }

  socket = io(BACKEND_URL, {
    auth: {
      token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: RECONNECT_DELAY,
    reconnectionDelayMax: 30000,
    timeout: 30000
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    reconnectAttempts = 0;
    tokenRefreshAttempts = 0;
    isServerAvailable = true;
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    
    // If server disconnected, mark it as potentially unavailable
    if (reason === 'io server disconnect' || reason === 'transport close') {
      isServerAvailable = false;
      lastServerCheck = 0; // Force server check on next attempt
    }
  });

  socket.on('connect_error', async (error) => {
    console.error('Socket connection error:', error.message || error);
    reconnectAttempts++;
    
    // Check if it's an authentication error
    if (error.message === 'Authentication error' || error.message === 'Invalid token') {
      console.log('Socket: Authentication error detected, attempting token refresh...');
      
      // Disable automatic reconnection to prevent retries with invalid token
      if (socket) {
        socket.io.reconnection(false);
      }
      
      // Check server availability before attempting token refresh
      const serverAvailable = await checkServerAvailability();
      if (!serverAvailable) {
        console.log('Socket: Server not available, waiting before retry...');
        // Re-enable reconnection after delay
        setTimeout(() => {
          if (socket) {
            socket.io.reconnection(true);
          }
        }, 5000);
        return;
      }
      
      if (tokenRefreshAttempts < MAX_TOKEN_REFRESH_ATTEMPTS) {
        tokenRefreshAttempts++;
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          console.log('Socket: Token refreshed, reconnecting with new token...');
          if (socket) {
            socket.auth = { token: newToken };
            socket.io.reconnection(true); // Re-enable reconnection
            socket.disconnect().connect();
          }
          reconnectAttempts = 0;
        } else {
          console.error('Socket: Token refresh failed, re-enabling reconnection for retry');
          // Re-enable reconnection after delay
          setTimeout(() => {
            if (socket) {
              socket.io.reconnection(true);
            }
          }, 5000);
        }
      } else {
        console.error('Socket: Max token refresh attempts reached, waiting for manual reconnection');
        // Re-enable reconnection after longer delay
        setTimeout(() => {
          if (socket) {
            socket.io.reconnection(true);
            tokenRefreshAttempts = 0; // Reset for future attempts
          }
        }, 30000);
      }
    } else if (error.message === 'websocket error') {
      // Websocket errors are often transient network issues
      console.log(`Socket: Websocket error (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) - will retry automatically`);
      // Check server availability
      await checkServerAvailability();
    } else {
      console.log(`Socket: Connection error (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}):`, error.message);
      
      // For connection errors, check server availability
      if (error.message.includes('ECONNREFUSED') || error.message.includes('Network error')) {
        isServerAvailable = false;
        lastServerCheck = 0;
        console.log('Socket: Server appears to be down, will retry when available');
      }
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Socket: Max reconnection attempts reached');
      }
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket reconnected after', attemptNumber, 'attempts');
    reconnectAttempts = 0;
    tokenRefreshAttempts = 0;
    isServerAvailable = true;
  });

  socket.on('reconnect_failed', () => {
    console.error('Socket reconnection failed');
    isServerAvailable = false;
    lastServerCheck = 0;
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    reconnectAttempts = 0;
  }
};

export const updateSocketToken = (token: string): void => {
  if (socket) {
    socket.auth = { token };
    socket.disconnect().connect();
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};
