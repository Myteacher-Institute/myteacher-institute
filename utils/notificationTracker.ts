interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: number;
  userType: 'admin' | 'instructor' | 'user';
  read: boolean;
}

const NOTIFICATION_STORAGE_KEY = 'notifications';
const NOTIFICATION_RETENTION_DAYS = 7;

export const notificationTracker = {
  // Get all notifications from localStorage
  getNotifications(): Notification[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse notifications:', error);
      return [];
    }
  },

  // Add a new notification
  addNotification(title: string, message: string, userType: 'admin' | 'instructor' | 'user'): void {
    if (typeof window === 'undefined') return;

    const notifications = this.getNotifications();
    const newNotification: Notification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      time: 'Just now',
      timestamp: Date.now(),
      userType,
      read: false,
    };

    // Add new notification at the beginning
    notifications.unshift(newNotification);

    // Keep only last 100 notifications
    const trimmedNotifications = notifications.slice(0, 100);

    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(trimmedNotifications));
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  },

  // Mark notification as read
  markAsRead(notificationId: string): void {
    if (typeof window === 'undefined') return;

    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );

    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  // Mark all notifications as read
  markAllAsRead(): void {
    if (typeof window === 'undefined') return;

    const notifications = this.getNotifications();
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));

    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },

  // Delete a notification
  deleteNotification(notificationId: string): void {
    if (typeof window === 'undefined') return;

    const notifications = this.getNotifications();
    const filteredNotifications = notifications.filter(notification => notification.id !== notificationId);

    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },

  // Clean up notifications older than 7 days
  cleanupOldNotifications(): void {
    if (typeof window === 'undefined') return;

    const notifications = this.getNotifications();
    const cutoffTime = Date.now() - (NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000);

    const filteredNotifications = notifications.filter(
      notification => notification.timestamp > cutoffTime
    );

    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(filteredNotifications));
    } catch (error) {
      console.error('Failed to cleanup notifications:', error);
    }
  },

  // Clear all notifications (on logout)
  clearNotifications(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },

  // Get formatted time ago string
  formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  },

  // Get notifications with updated time strings
  getFormattedNotifications(userType?: 'admin' | 'instructor' | 'user'): Notification[] {
    const notifications = this.getNotifications();
    const filtered = userType ? notifications.filter(n => n.userType === userType) : notifications;
    return filtered.map(notification => ({
      ...notification,
      time: this.formatTimeAgo(notification.timestamp),
    }));
  },

  // Get unread notification count
  getUnreadCount(userType?: 'admin' | 'instructor' | 'user'): number {
    const notifications = this.getNotifications();
    const filtered = userType ? notifications.filter(n => n.userType === userType) : notifications;
    return filtered.filter(n => !n.read).length;
  },
};

// Initialize cleanup on app load
if (typeof window !== 'undefined') {
  notificationTracker.cleanupOldNotifications();
}
