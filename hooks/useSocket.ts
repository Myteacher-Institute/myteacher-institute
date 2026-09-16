import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import {
  initializeSocket,
  disconnectSocket,
  updateSocketToken,
  getSocket,
  subscribeSocketChanges,
} from '@/lib/socket';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  updateToken: (token: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  // The socket instance is a shared singleton managed by lib/socket.ts.
  // This hook mirrors it so every consumer (SocketProvider, ChatThread,
  // dashboard pages…) sees the SAME live socket and receives its events.
  const [socket, setSocket] = useState<Socket | null>(getSocket());
  const [isConnected, setIsConnected] = useState<boolean>(socket?.connected ?? false);

  useEffect(() => {
    const sync = () => {
      const current = getSocket();
      setSocket(current);
      setIsConnected(current?.connected ?? false);
    };

    sync();
    const unsubscribe = subscribeSocketChanges(sync);
    return unsubscribe;
  }, []);

  // Track connect/disconnect for the current socket instance
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    setIsConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  const connect = useCallback((token: string) => {
    const socketInstance = initializeSocket(token);
    setSocket(socketInstance);
    setIsConnected(socketInstance.connected);
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
    setSocket(null);
    setIsConnected(false);
  }, []);

  const updateToken = useCallback((token: string) => {
    updateSocketToken(token);
  }, []);

  return {
    socket,
    isConnected,
    connect,
    disconnect,
    updateToken,
  };
};