interface Activity {
  id: string;
  action: string;
  detail: string;
  time: string;
  timestamp: number;
  userType: 'admin' | 'instructor' | 'user';
}

const ACTIVITY_STORAGE_PREFIX = 'recent-activities-';
const ACTIVITY_RETENTION_DAYS = 5;

export const activityTracker = {
  // Get storage key for a specific user
  getStorageKey(userId: string): string {
    return `${ACTIVITY_STORAGE_PREFIX}${userId}`;
  },

  // Get all activities from localStorage for a specific user
  getActivities(userId: string): Activity[] {
    if (typeof window === 'undefined' || !userId) return [];
    try {
      const storageKey = this.getStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse activities:', error);
      return [];
    }
  },

  // Add a new activity for a specific user
  addActivity(action: string, detail: string, userType: 'admin' | 'instructor' | 'user', userId: string): void {
    if (typeof window === 'undefined' || !userId) return;
    
    const activities = this.getActivities(userId);
    const newActivity: Activity = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      detail,
      time: 'Just now',
      timestamp: Date.now(),
      userType,
    };

    // Add new activity at the beginning
    activities.unshift(newActivity);
    
    // Keep only last 50 activities
    const trimmedActivities = activities.slice(0, 50);
    
    try {
      const storageKey = this.getStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(trimmedActivities));
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  },

  // Clean up activities older than 5 days for a specific user
  cleanupOldActivities(userId: string): void {
    if (typeof window === 'undefined' || !userId) return;
    
    const activities = this.getActivities(userId);
    const cutoffTime = Date.now() - (ACTIVITY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    
    const filteredActivities = activities.filter(
      activity => activity.timestamp > cutoffTime
    );
    
    try {
      const storageKey = this.getStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(filteredActivities));
    } catch (error) {
      console.error('Failed to cleanup activities:', error);
    }
  },

  // Clear all activities for a specific user (on logout)
  clearActivities(userId: string): void {
    if (typeof window === 'undefined' || !userId) return;
    try {
      const storageKey = this.getStorageKey(userId);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to clear activities:', error);
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

  // Get activities with updated time strings for a specific user
  getFormattedActivities(userId: string): Activity[] {
    const activities = this.getActivities(userId);
    return activities.map(activity => ({
      ...activity,
      time: this.formatTimeAgo(activity.timestamp),
    }));
  },
};

// Initialize cleanup on app load for current user (if available)
if (typeof window !== 'undefined') {
  // This will be called when the user is authenticated
  // The actual cleanup should be called with the specific userId
}
