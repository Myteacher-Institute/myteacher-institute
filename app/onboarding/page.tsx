"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useAuthStore } from '@/store/auth.store';
import { onboardingSchema } from '@/validation/auth.schema';
import { useRouter, useSearchParams } from 'next/navigation';

function OnboardingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeOnboarding, isLoading, error, user, pendingUserId } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const userId =
    searchParams.get('userId') ||
    pendingUserId ||
    (user && '_id' in user ? user._id : '');

  // Pre-fill the user's name (Google already provides it).
  useEffect(() => {
    if (!formData.name && user && 'name' in user) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user, formData.name]);

  // No account to onboard -> send back to sign-in.
  useEffect(() => {
    if (!userId && !isLoading) {
      router.replace('/get-started');
    }
  }, [userId, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = onboardingSchema.safeParse(formData);
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

    if (!userId) {
      setFieldErrors({ _form: 'Account is missing. Please sign in again.' });
      return;
    }

    await completeOnboarding(userId, formData.name, formData.password);

    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      router.push('/student');
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white p-4 font-sans select-none overflow-hidden">
      <div
        className="grid grid-cols-1 md:grid-cols-2 w-full h-full bg-white shadow-2xl overflow-hidden rounded-none"
        style={{ maxWidth: '1000px', maxHeight: '650px' }}
      >
        <div className="w-full relative h-full bg-[#eaeaea] hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
            alt="Person completing setup"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        <div className="w-full bg-white h-full flex flex-col justify-center items-center px-6 py-2 md:py-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-4 md:mb-6 flex-shrink-0">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-9 object-contain" />
          </div>

          <h2 className="text-[#111111] text-[20px] md:text-[24px] font-bold mb-1 md:mb-2 tracking-tight text-center flex-shrink-0">
            Complete Your Profile
          </h2>
          <p className="text-[#71717a] text-[12px] md:text-[13px] mb-3 md:mb-5 text-center flex-shrink-0">
            Your account is almost ready. Confirm your name and create a password.
          </p>

          {(error || fieldErrors._form) && (
            <div className="w-full mb-3 p-2 bg-red-50 border border-red-200 rounded-[6px]">
              <p className="text-red-600 text-[11px] md:text-[12px] text-center">{error || fieldErrors._form}</p>
            </div>
          )}

          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">
            <form className="w-full flex flex-col gap-2.5 md:gap-3.5" onSubmit={handleSubmit}>
              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Full Name</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type="text"
                    placeholder="Nwachukwu Collins Chibunna"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full h-full px-4 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.name ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.name && (
                  <p className="text-red-600 text-[10px] md:text-[11px]">{fieldErrors.name}</p>
                )}
              </div>

              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Password</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="**********"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full h-full pl-4 pr-12 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  <div className="absolute right-4 text-[#71717a] z-10 flex items-center justify-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </div>
                </div>
                {fieldErrors.password && (
                  <p className="text-red-600 text-[10px] md:text-[11px]">{fieldErrors.password}</p>
                )}
              </div>

              <div className="w-full flex flex-col gap-0.5 flex-shrink-0">
                <label className="text-[#111111] font-semibold text-[13px] md:text-[14px]">Confirm Password</label>
                <div className="relative w-full flex items-center" style={{ height: '44px' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="**********"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full h-full pl-4 pr-12 border border-[#b3b3b3] rounded-[6px] text-[13px] md:text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  <div className="absolute right-4 text-[#71717a] z-10 flex items-center justify-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </div>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-red-600 text-[10px] md:text-[11px]">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex-shrink-0 flex items-center justify-center mt-1"
                style={{ height: '44px', cursor: 'pointer' }}
              >
                {isLoading ? 'Finishing setup...' : 'Finish Setup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-white p-4 font-sans select-none overflow-hidden">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingPageContent />
    </Suspense>
  );
}