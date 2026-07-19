// Web Push API integration for push notification fallback

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

let pushSubscription: PushSubscription | null = null;
let registration: ServiceWorkerRegistration | null = null;

export const isPushNotificationSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  try {
    if (!isPushNotificationSupported()) {
      console.warn('Push notifications are not supported in this browser');
      return null;
    }

    registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

export const requestPushPermission = async (): Promise<NotificationPermission> => {
  try {
    if (!isPushNotificationSupported()) {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('Push notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting push permission:', error);
    return 'denied';
  }
};

export const subscribeToPushNotifications = async (): Promise<PushSubscription | null> => {
  try {
    if (!registration) {
      registration = await registerServiceWorker();
    }

    if (!registration) {
      throw new Error('Service Worker not registered');
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY) as any
    });

    pushSubscription = subscription;
    console.log('Push subscription successful:', subscription);
    
    // Send subscription to backend
    await sendSubscriptionToBackend(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
};

export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  try {
    if (pushSubscription) {
      await pushSubscription.unsubscribe();
      pushSubscription = null;
      console.log('Unsubscribed from push notifications');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Unsubscribe failed:', error);
    return false;
  }
};

export const getPushSubscription = (): PushSubscription | null => {
  return pushSubscription;
};

const sendSubscriptionToBackend = async (subscription: PushSubscription): Promise<void> => {
  try {
    // This would typically send the subscription to your backend
    // For now, we'll just log it
    console.log('Subscription to send to backend:', JSON.stringify(subscription));
    
    // TODO: Implement actual API call to save subscription
    // await fetch('/api/push/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(subscription)
    // });
  } catch (error) {
    console.error('Error sending subscription to backend:', error);
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray as any;
}

export const showLocalNotification = (title: string, options: NotificationOptions = {}): void => {
  if (typeof window === 'undefined') return;
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
};
