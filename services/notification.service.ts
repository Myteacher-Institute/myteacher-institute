import axiosInstance from '@/lib/axios';

export interface Notification {
  _id: string;
  recipientId: string;
  recipientType: 'admin' | 'instructor' | 'user';
  type: 'course' | 'achievement' | 'system' | 'reminder' | 'payment' | 'enrollment';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  status: 'success' | 'failed';
  message: string;
  notifications?: Notification[];
  total?: number;
}

export const notificationService = {
  getNotifications: async (limit = 20, skip = 0) => {
    const res = await axiosInstance.get('/api/notification', { params: { limit, skip, userType: 'user' } });
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await axiosInstance.get('/api/notification/unread-count', { params: { userType: 'user' } });
    return res.data;
  },

  markAsRead: async (notificationId: string) => {
    const res = await axiosInstance.patch(`/api/notification/${notificationId}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await axiosInstance.patch('/api/notification/read-all', { params: { userType: 'user' } });
    return res.data;
  },

  deleteNotification: async (notificationId: string) => {
    const res = await axiosInstance.delete(`/api/notification/${notificationId}`);
    return res.data;
  },

  deleteAllNotifications: async () => {
    const res = await axiosInstance.delete('/api/notification', { params: { userType: 'user' } });
    return res.data;
  }
};