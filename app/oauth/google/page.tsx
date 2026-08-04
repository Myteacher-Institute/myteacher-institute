"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import { useAuthStore } from '@/store/auth.store';
import { AuthUser } from '@/types';

function resolveUserType(user: AuthUser): 'user' | 'admin' | 'instructor' {
  if ('isAdmin' in user) return 'admin';
  if ('isVerified' in user) return 'instructor';
  return 'user';
}

export default function GoogleOAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status') || '';
    const redirectParam = searchParams.get('redirect') || '';
    const error = searchParams.get('error') || '';

    let cancelled = false;

    const finish = async () => {
      if (status === 'auth_failed' || status === 'session_failed' || status === 'server_error' || error) {
        router.replace(`/get-started?error=${encodeURIComponent('Google sign-in failed. Please try again or use email.')}`);
        return;
      }

      try {
        const tokenRes = await authService.getNewAccessToken();
        const accessToken = tokenRes?.accessToken;

        if (!accessToken) {
          router.replace('/get-started?error=Could not complete Google sign-in.');
          return;
        }

        const { setAccessToken, setUser, setUserType } = useAuthStore.getState();
        setAccessToken(accessToken);
        setUserType(null);

        // Fetch the account so the store has the full user (incl. affiliate fields).
        const profile = await userService.getCurrentUser();
        if (cancelled) return;

        const user = profile?.user;
        const userType = user ? resolveUserType(user) : 'user';
        setUser(user ?? null, userType);
        setUserType(userType);

        // Prefer a redirect the auth flow recorded (e.g. /affiliate-dashboard),
        // then the one the backend passed, then the type-appropriate dashboard.
        let target =
          (typeof window !== 'undefined' ? sessionStorage.getItem('pendingRedirect') : null) ||
          redirectParam ||
          (userType === 'instructor'
            ? '/instructor'
            : userType === 'admin'
            ? '/admin'
            : '/student');

        if (target === '/dashboard') {
          target = '/student';
        }
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('pendingRedirect');
        }

        router.replace(target);
      } catch (err) {
        console.error('Google OAuth callback failed:', err);
        router.replace('/get-started?error=Could not complete Google sign-in.');
      }
    };

    finish();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-500">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Completing your sign-in...</p>
      </div>
    </div>
  );
}
