import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { initializeSocket, disconnectSocket, updateSocketToken, isSocketConnected } from '@/lib/socket';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  updateToken: (token: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((token: string) => {
    const socketInstance = initializeSocket(token);
    setSocket(socketInstance);
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    setSocket(null);
    setIsConnected(false);
  }, []);

  const updateToken = useCallback((token: string) => {
    updateSocketToken(token);
  }, []);

  useEffect(() => {
    // Update connection status when socket connects/disconnects
    if (socket) {
      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));

      return () => {
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    updateToken
  };
};
