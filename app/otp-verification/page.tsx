"use client";

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { verifyOtpSchema } from '@/validation/auth.schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { decryptFromUrl } from '@/utils/encryption';

export default function OtpVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const emailParam = searchParams.get('email') || '';
  const email = emailParam ? decryptFromUrl(emailParam) : '';
  const role = searchParams.get('role') || 'user';

  const { verifyOtp, resendOtp, isLoading, error } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [resendMessage, setResendMessage] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = verifyOtpSchema.safeParse({ otp });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    await verifyOtp(otp);

    const { isAuthenticated, userType, user, accessToken } = useAuthStore.getState();
    console.log('After verifyOtp - isAuthenticated:', isAuthenticated, 'userType:', userType, 'user:', user, 'accessToken:', accessToken);

    if (isAuthenticated && userType) {
      // Both registration and login flows - user is now verified
      switch (userType) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'instructor':
          router.push('/instructor/dashboard');
          break;
        case 'user':
          router.push('/student');
          break;
      }
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || !email) return;

    const response = await resendOtp(email);
    setResendMessage(response.message);

    if (response.status === 'success') {
      setCanResend(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Verify OTP</h1>
          <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
            Enter the code sent to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              One-Time Password
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className={`w-full px-4 py-3 rounded-lg border ${
                fieldErrors.otp ? 'border-red-500' : isDark ? 'border-slate-600' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest ${isDark ? 'bg-slate-700 text-white' : 'bg-white'}`}
              placeholder="*******"
            />
            {fieldErrors.otp && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.otp}</p>
            )}
            <p className={`mt-2 text-sm text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Enter code from your email
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              cursor: "pointer" 
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          {resendMessage && (
            <p className={`text-sm mb-3 ${resendMessage.includes('success') || resendMessage.includes('resent') ? 'text-green-600' : 'text-red-600'}`}>
              {resendMessage}
            </p>
          )}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend || isLoading}
            className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push('/get-started')}
            className={`text-sm ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
