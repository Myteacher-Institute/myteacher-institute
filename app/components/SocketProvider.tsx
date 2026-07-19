"use client";

import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useNotificationStore } from '@/store/notification.store';
import { useAuthStore } from '@/store/auth.store';
import { triggerNotificationFeedback } from '@/utils/notificationAudio';
import { showLocalNotification } from '@/lib/pushNotifications';
import { initializeAuth } from '@/lib/authInitializer';
import { updateSocketToken, disconnectSocket } from '@/lib/socket';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket, isConnected, connect } = useSocket();
  const { syncWithSocket } = useNotificationStore();
  const { user, userType } = useAuthStore();
  const socketInitialized = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Clean up reconnect timeout on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user || !userType || socketInitialized.current) return;

    // Get access token from auth-storage (source of truth — always up to date)
    const getAccessToken = (): string => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          const token = parsed?.state?.accessToken;
          if (token && token.length > 50) return token;
        }
      } catch {
        // fall through to cookie fallback
      }

      // Cookie fallback (e.g. SSR hydration edge cases)
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find(cookie =>
        cookie.trim().startsWith('accessToken=')
      );
      const token = accessTokenCookie?.split('=')[1] || '';

      if (!token || token.length < 50) {
        console.log('Socket: No valid token found, skipping connection');
        return '';
      }

      return token;
    };

    // Additional token validation before connection
    const validateToken = (token: string): boolean => {
      if (!token || token.length < 50) {
        return false;
      }
      
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          return false;
        }
        
        const payload = JSON.parse(atob(parts[1]));
        const now = Date.now() / 1000;
        
        if (payload.exp && payload.exp < now) {
          console.log('Socket: Token is expired, will attempt refresh');
          return false;
        }
        
        return true;
      } catch (error) {
        console.log('Socket: Token validation failed:', error);
        return false;
      }
    };

    const token = getAccessToken();
    
    // If token is invalid, try to refresh it before connecting
    if (!validateToken(token)) {
      console.log('Socket: Token validation failed, attempting refresh before connection');
      
      const attemptConnectionWithRefresh = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/auth/new-access-code`, {
            method: 'GET',
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.accessToken) {
              console.log('Socket: Token refreshed successfully, now connecting');
              connect(data.accessToken);
              socketInitialized.current = true;
              
              // Update localStorage with new token
              const authStorage = localStorage.getItem('auth-storage');
              if (authStorage) {
                const parsed = JSON.parse(authStorage);
                parsed.state.accessToken = data.accessToken;
                localStorage.setItem('auth-storage', JSON.stringify(parsed));
              }
              
              return;
            }
          }
        } catch (error) {
          console.error('Socket: Failed to refresh token during initialization:', error);
        }
        
        console.log('Socket: Could not refresh token, skipping socket connection');
      };
      
      attemptConnectionWithRefresh();
      return;
    }
    
    if (token) {
      console.log('Socket: Attempting connection with valid token');
      connect(token);
      socketInitialized.current = true;

      // Emit user online status
      if (socket) {
        socket.emit('user:online', { userType });
      }
    } else {
      console.log('Socket: No valid token available, skipping socket connection');
    }

    return () => {
      disconnectSocket();
      socketInitialized.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user, userType, connect]);

  // Handle server restart and reconnection
  useEffect(() => {
    if (!socket || !userType) return;

    const handleDisconnect = (reason: string) => {
      console.log('Socket: Disconnected due to:', reason);
      
      // If the disconnect was due to server issues, attempt reconnection with delay
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setIsReconnecting(true);
        
        // Clear any existing timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Attempt to reconnect after a delay to allow server to come back
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Socket: Attempting to reconnect after server disconnect...');
          
          // Get fresh token
          const getAccessToken = (): string => {
            try {
              const authStorage = localStorage.getItem('auth-storage');
              if (authStorage) {
                const parsed = JSON.parse(authStorage);
                const token = parsed?.state?.accessToken;
                if (token && token.length > 50) return token;
              }
            } catch {
              // fall through to cookie fallback
            }

            const cookies = document.cookie.split(';');
            const accessTokenCookie = cookies.find(cookie =>
              cookie.trim().startsWith('accessToken=')
            );
            return accessTokenCookie?.split('=')[1] || '';
          };

          const token = getAccessToken();
          if (token) {
            // Validate token before reconnecting
            const validateToken = (token: string): boolean => {
              if (!token || token.length < 50) {
                return false;
              }
              
              try {
                const parts = token.split('.');
                if (parts.length !== 3) {
                  return false;
                }
                
                const payload = JSON.parse(atob(parts[1]));
                const now = Date.now() / 1000;
                
                if (payload.exp && payload.exp < now) {
                  return false;
                }
                
                return true;
              } catch (error) {
                return false;
              }
            };
            
            if (validateToken(token)) {
              connect(token);
            } else {
              console.log('Socket: Token invalid during reconnection, attempting refresh');
              // Try to refresh token
              fetch(`${BACKEND_URL}/api/auth/new-access-code`, {
                method: 'GET',
                credentials: 'include',
              }).then(response => {
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Token refresh failed');
              }).then(data => {
                if (data.accessToken) {
                  connect(data.accessToken);
                  // Update localStorage
                  const authStorage = localStorage.getItem('auth-storage');
                  if (authStorage) {
                    const parsed = JSON.parse(authStorage);
                    parsed.state.accessToken = data.accessToken;
                    localStorage.setItem('auth-storage', JSON.stringify(parsed));
                  }
                }
              }).catch(error => {
                console.error('Socket: Failed to refresh token during reconnection:', error);
              });
            }
          }
          
          setIsReconnecting(false);
        }, 3000); // Wait 3 seconds before reconnect attempt
      }
    };

    const handleReconnect = () => {
      console.log('Socket: Successfully reconnected');
      setIsReconnecting(false);
      
      // Re-emit user online status
      socket.emit('user:online', { userType });
    };

    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);

    return () => {
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
    };
  }, [socket, userType, connect]);

  useEffect(() => {
    if (!socket || !isConnected || !userType) return;

    // Sync notification store with socket
    syncWithSocket(socket, userType);

    // Listen for auth store token changes to keep socket in sync
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.accessToken,
      (newToken) => {
        if (socket && newToken && socket.auth?.token !== newToken) {
          console.log('Socket: Access token updated in store, reconnecting...');
          updateSocketToken(newToken);
        }
      }
    );

    // Listen for new notifications and trigger feedback
    const handleNewNotification = (data: { notification: any }) => {
      triggerNotificationFeedback(data.notification.type);
      
      // Show local notification if page is not visible
      if (document.hidden) {
        showLocalNotification(data.notification.title, {
          body: data.notification.message,
          icon: '/favicon.ico'
        });
      }
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
      unsubscribe();
    };
  }, [socket, isConnected, userType, syncWithSocket]);

  return <>{children}</>;
};
