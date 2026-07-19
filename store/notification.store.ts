import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Socket } from 'socket.io-client';

interface Notification {
  _id: string;
  recipientId: string;
  recipientType: 'admin' | 'instructor' | 'user';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  relatedId?: string;
  relatedType?: string;
  createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  setUnreadCount: (count: number) => void;
  setConnected: (connected: boolean) => void;
  syncWithSocket: (socket: Socket | null, userType: 'admin' | 'instructor' | 'user') => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isConnected: false,

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100),
          unreadCount: state.unreadCount + (notification.read ? 0 : 1)
        }));
      },

      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
          unreadCount: 0
        }));
      },

      deleteNotification: (notificationId) => {
        set((state) => {
          const notification = state.notifications.find((n) => n._id === notificationId);
          return {
            notifications: state.notifications.filter((n) => n._id !== notificationId),
            unreadCount: notification && !notification.read 
              ? Math.max(0, state.unreadCount - 1) 
              : state.unreadCount
          };
        });
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      setUnreadCount: (count) => {
        set({ unreadCount: count });
      },

      setConnected: (connected) => {
        set({ isConnected: connected });
      },

      syncWithSocket: (socket, userType) => {
        if (!socket) return;

        // Listen for new notifications
        socket.on('notification:new', (data: { notification: Notification }) => {
          if (data.notification.recipientType === userType) {
            get().addNotification(data.notification);
          }
        });

        // Listen for unread count updates
        socket.on('notification:unread_count', (data: { count: number }) => {
          get().setUnreadCount(data.count);
        });

        // Listen for user status changes
        socket.on('user:status_changed', (data: { userId: string; userType: string; isOnline: boolean }) => {
          // Can be used to update online status indicators
          console.log('User status changed:', data);
        });

        // Cleanup on unmount
        return () => {
          socket.off('notification:new');
          socket.off('notification:unread_count');
          socket.off('user:status_changed');
        };
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications,
        unreadCount: state.unreadCount 
      })
    }
  )
);
