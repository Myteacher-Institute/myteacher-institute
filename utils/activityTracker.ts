export interface Activity {
  id: string;
  action: string;
  detail: string;
  time: string;
  timestamp: number;
  userType: 'admin' | 'instructor' | 'user';
}

const ACTIVITY_STORAGE_KEY = 'recent-activities';
const ACTIVITY_RETENTION_DAYS = 5;

export const activityTracker = {
  // Get all activities from localStorage
  getActivities(): Activity[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse activities:', error);
      return [];
    }
  },

  // Add a new activity
  addActivity(action: string, detail: string, userType: 'admin' | 'instructor' | 'user'): void {
    if (typeof window === 'undefined') return;
    
    const activities = this.getActivities();
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
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(trimmedActivities));
    } catch (error) {
      console.error('Failed to save activity:', error);
    }
  },

  // Clean up activities older than 5 days
  cleanupOldActivities(): void {
    if (typeof window === 'undefined') return;
    
    const activities = this.getActivities();
    const cutoffTime = Date.now() - (ACTIVITY_RETENTION_DAYS * 24 * 60 * 60 * 1000);
    
    const filteredActivities = activities.filter(
      activity => activity.timestamp > cutoffTime
    );
    
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(filteredActivities));
    } catch (error) {
      console.error('Failed to cleanup activities:', error);
    }
  },

  // Clear all activities (on logout)
  clearActivities(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
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

  // Get activities with updated time strings
  getFormattedActivities(): Activity[] {
    const activities = this.getActivities();
    return activities.map(activity => ({
      ...activity,
      time: this.formatTimeAgo(activity.timestamp),
    }));
  },
};

// Initialize cleanup on app load
if (typeof window !== 'undefined') {
  activityTracker.cleanupOldActivities();
}
