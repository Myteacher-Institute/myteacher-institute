import axiosInstance from './axios';
import { API_CONFIG } from '../config/api';

/**
 * Initialize authentication on app load.
 * Decodes the stored JWT and silently refreshes it only when it is
 * actually expired.  If there is no token, or the token is still valid,
 * we do nothing — avoiding spurious GET /api/auth/new-access-code calls
 * that produce 401s during the OTP login flow.
 */
export const initializeAuth = async () => {
  if (typeof window === 'undefined') return;          // SSR guard

  const authStorage = localStorage.getItem('auth-storage');
  if (!authStorage) return;

  try {
    const parsedAuth = JSON.parse(authStorage);
    const token = parsedAuth?.state?.accessToken;

    if (!token) {
      localStorage.removeItem('auth-storage');
      return;
    }

    // Decode JWT payload (no signature check — just expiry)
    let decoded: { exp?: number };
    try {
      decoded = JSON.parse(atob(token.split('.')[1]));
    } catch {
      console.error('Auth: Malformed token, clearing storage');
      localStorage.removeItem('auth-storage');
      return;
    }

    // Add a 60-second buffer so we refresh slightly before hard expiry
    const expiresAt = (decoded.exp ?? 0) * 1000;
    const isExpiredOrExpiringSoon = expiresAt - Date.now() < 60_000;

    if (!isExpiredOrExpiringSoon) {
      // Token still valid — nothing to do
      return;
    }

    // Attempt silent refresh via axiosInstance so the isAuthEndpoint guard
    // does NOT apply (new-access-code is intentionally called here).
    try {
      const response = await axiosInstance.get('/api/auth/new-access-code');
      const newToken = response.data.accessToken;

      if (!newToken) throw new Error('No accessToken in refresh response');

      // Update localStorage
      parsedAuth.state.accessToken = newToken;
      localStorage.setItem('auth-storage', JSON.stringify(parsedAuth));

      // Keep the cookie in sync — SocketProvider reads from here
      document.cookie = `accessToken=${newToken}; path=/; max-age=86400; SameSite=lax`;

      console.log('Auth: Silent token refresh successful');
    } catch (refreshError) {
      console.warn('Auth: Silent token refresh failed, clearing storage:', refreshError);
      localStorage.removeItem('auth-storage');
    }
  } catch (e) {
    console.error('Auth initialization error:', e);
    localStorage.removeItem('auth-storage');
  }
};
