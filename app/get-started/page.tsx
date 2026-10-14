"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { HiOutlineMail, HiOutlineX, HiOutlineShare } from 'react-icons/hi';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { verifyPasswordSchema } from '@/validation/auth.schema';
import { useRouter, useSearchParams } from 'next/navigation';
import { encryptForUrl } from '@/utils/encryption';
import Link from 'next/link';
import { API_CONFIG } from '@/config/api';

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { checkUserExists, login, verifyOtp, isLoading, error, clearInstruction } = useAuthStore();
  // verifyOtp is kept for future use
  void verifyOtp;
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'email' | 'password'>('email');

  // Affiliate intent: when the proxy sends a not-signed-in visitor here from
  // /affiliate-dashboard, greet them with a modal offering Google or the
  // normal email/password flow, then return them to /affiliate-dashboard.
  const intent = searchParams.get('intent') || '';
  const redirectTo = searchParams.get('redirect') || '';
  const [showAffiliateModal, setShowAffiliateModal] = useState(intent === 'affiliate');

  // Remember where to send the user once auth completes (read by the OTP and
  // onboarding pages after verification).
  useEffect(() => {
    if (redirectTo) {
      try {
        sessionStorage.setItem('pendingRedirect', redirectTo);
      } catch {
        // ignore — storage can be unavailable in some private modes
      }
    }
  }, [redirectTo]);

  const handleGoogleSignIn = () => {
    window.location.href = `${API_CONFIG.baseURL}/api/auth/google`;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!email) {
      setFieldErrors({ email: 'Email is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFieldErrors({ email: 'Invalid email format' });
      return;
    }

    const { userExists } = await checkUserExists(email);

    if (userExists) {
      setStep('password');
    } else {
      router.push(`/create-account?email=${encryptForUrl(email)}`);
    }

    console.log(`this is the response ${userExists}`)
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = verifyPasswordSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    await login(email, password);

    const { instruction: responseInstruction } = useAuthStore.getState();

    if (responseInstruction === 'give-code') {
      router.push(`/otp-verification?email=${encryptForUrl(email)}`);
    }
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    clearInstruction();
  };

  return (
    <div className={`flex min-h-screen w-full items-center justify-center p-4 font-sans select-none ${isDark ? 'bg-slate-900' : 'bg-white'}`}>

      {/* Main Container Card - Force a strict layout container */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 w-full shadow-2xl overflow-hidden rounded-none ${isDark ? 'bg-slate-800' : 'bg-white'}`}
        style={{ maxWidth: '940px', minHeight: '600px' }}
      >

        {/* Left Section: Image Split */}
        <div className="w-full relative min-h-[300px] md:min-h-full bg-[#eaeaea]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop"
            alt="Student with VR Headset"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Section: Form Sheet - Using flex-col with dynamic padding to ensure nothing is cut off */}
        <div className={`w-full flex flex-col justify-center items-center px-6 py-8 md:py-12 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>

          {/* Logo Assembly - Precise Vector Dimensions */}
          {/* FIXED: Added mb-10 for clean layout spacing before the heading */}
          <div className="flex items-center gap-3 mb-10 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-[180px] h-10 object-contain" />
          </div>

          {/* Form Header */}
          <h2 className={`text-[24px] font-bold mb-6 tracking-tight text-center flex-shrink-0 ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            {step === 'email' ? 'Get started' : 'Enter your password'}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px]">
              <p className="text-red-600 text-[12px] text-center">{error}</p>
            </div>
          )}

          {/* Fixed Width Action Block Container */}
          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            
            {/* Google Authentication Button */}
            {step === 'email' && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full border border-[#b3b3b3] rounded-[6px] flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors flex-shrink-0 cursor-pointer"
                style={{ height: '48px' }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', display: 'block' }}
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-[#111111] font-semibold text-[14px]">Google</span>
              </button>
            )}

            {/* Split Middle Line Separator - Clear and Visible Lines */}
            {step === 'email' && (
              <div className="w-full flex items-center my-5 flex-shrink-0">
                <div className="flex-grow border-t border-[#b3b3b3]"></div>
                <span className="px-3 text-[#111111] text-[14px] font-normal">Or</span>
                <div className="flex-grow border-t border-[#b3b3b3]"></div>
              </div>
            )}

            {/* Email Form */}
            {step === 'email' ? (
              <form className="w-full flex flex-col gap-4" onSubmit={handleEmailSubmit}>
                
                {/* Email Input Field Container */}
                <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                  <div className="absolute left-4 text-[#71717a] z-10 flex items-center justify-center pointer-events-none">
                    <HiOutlineMail size={20} className="stroke-[1.5]" />
                  </div>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] placeholder-[#71717a] focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.email ? 'border-red-500' : ''} ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-[#111111]'}`}
                    required
                  />
                </div>


                {/* Primary Action Button - Solid Blue with clear text */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center"
                  style={{ height: '48px', cursor: "pointer" }}
                >
                  {isLoading ? 'Processing...' : 'Get started'}
                </button>
              </form>
            ) : (
              <form className="w-full flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
                
                {/* Password Input Field Container */}
                <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[14px] placeholder-[#71717a] focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.password ? 'border-red-500' : ''} ${isDark ? 'bg-slate-700 text-white' : 'bg-white text-[#111111]'}`}
                    required
                  />
                </div>

                {fieldErrors.password && (
                  <p className="text-red-600 text-[12px]">{fieldErrors.password}</p>
                )}

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full border border-[#b3b3b3] text-[#111111] font-semibold text-[14px] rounded-[6px] transition-colors flex-shrink-0 flex items-center justify-center"
                  style={{ height: '48px' }}
                >
                  ← Back
                </button>

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center cursor-pointer"
                  style={{ height: '48px' }}
                >
                  {isLoading ? 'Verifying...' : 'Sign in'}
                </button>
              </form>
            )}

          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2 w-full">
            <Link href="/reset-password" className={isDark ? "text-sm text-[#fff] hover:text-[#ccc] cursor-pointer block" : "text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block"}>
              Forgot password?
            </Link>

            <div className="divider mt-4 border-t border-[#b3b3b3]"></div>

            <Link href="/instructor/login" className={isDark ? "text-sm text-[#fff] hover:text-[#ccc] cursor-pointer block" : "text-sm text-[#71717a] hover:text-[#111111] cursor-pointer block"}>
              Login as Instructor
            </Link>
          </div>

        </div>
      </div>

      {/* Affiliate sign-up modal — shown when a not-signed-in visitor tried to
          open /affiliate-dashboard. Offers Google or the normal input flow. */}
      {showAffiliateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Join the affiliate program"
        >
          <div className={`relative w-full max-w-md rounded-2xl p-8 shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
            <button
              type="button"
              onClick={() => setShowAffiliateModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#71717a] hover:text-[#111111] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <HiOutlineX size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <HiOutlineShare size={22} />
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
                Become an Affiliate
              </h2>
            </div>

            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-[#71717a]'}`}>
              Create an account to start earning commissions on every course
              you refer. It takes less than a minute.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full border border-[#b3b3b3] rounded-[6px] flex items-center justify-center gap-3 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ height: '48px' }}
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{ width: '18px', height: '18px', minWidth: '18px', minHeight: '18px', display: 'block' }}
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-[#111111] font-semibold text-[14px]">Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAffiliateModal(false)}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex items-center justify-center cursor-pointer"
                style={{ height: '48px' }}
              >
                Create Account or Sign In
              </button>
            </div>

            <p className={`text-xs text-center mt-5 ${isDark ? 'text-slate-500' : 'text-[#71717a]'}`}>
              Already an affiliate? Close this and sign in below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen w-full items-center justify-center p-4 font-sans select-none bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}