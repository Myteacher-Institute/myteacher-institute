import Pusher from 'pusher-js';
import axiosInstance from './axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

let pusher: Pusher | null = null;
let currentUserId: string | null = null;

export interface PusherAuthRequest {
  socket_id: string;
  channel_name: string;
}

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
  const accessTokenCookie = cookies.find((c) => c.trim().startsWith('accessToken='));
  return accessTokenCookie?.split('=')[1] || '';
};

export const initializePusher = (userId: string): Pusher => {
  // Reuse the existing connection for the SAME user even if it is not
  // "connected" yet (or is temporarily reconnecting). Destroying the instance
  // here would silently kill the channels every other component already
  // subscribed to (chat threads, notifications), so real-time messages stop
  // arriving with no visible error. pusher-js queues subscriptions while the
  // socket is connecting, so reuse is always safe.
  if (pusher && currentUserId === userId) {
    return pusher;
  }

  // A different user signed in (or first init): tear down the previous instance.
  if (pusher) {
    try {
      pusher.disconnect();
    } catch {
      // ignore
    }
  }

  currentUserId = userId;

  pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'eu',
    forceTLS: true,
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        const request: PusherAuthRequest = {
          socket_id: socketId,
          channel_name: channel.name,
        };
        axiosInstance
          .post(`${BACKEND_URL}/api/pusher/auth`, request)
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            callback(error, null);
          });
      },
    }),
  });

  return pusher;
};

export const disconnectPusher = (): void => {
  if (pusher) {
    try {
      pusher.disconnect();
    } catch {
      // ignore
    }
    pusher = null;
    currentUserId = null;
  }
};

export const getPusher = (): Pusher | null => pusher;
