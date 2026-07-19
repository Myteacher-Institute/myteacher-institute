"use client";

import React, { useState, useRef } from 'react';
import { HiOutlineMail, HiOutlineUser, HiOutlinePhone } from 'react-icons/hi';
import { FiLock, FiUpload, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SPECIALIZATIONS = [
  'Frontend Development Tutor',
  'Backend Development Tutor',
  'UI/UX Design Tutor',
  'Content Creation Tutor',
  'Mobile App Development Tutor',
  'DevOps & Cloud Engineering Tutor',
  'Data Science & Machine Learning Tutor',
  'Cybersecurity Tutor',
  'Blockchain & Web3 Development Tutor',
  'Product Management Tutor',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function InstructorApplyPage() {
  const router = useRouter();
  const { instructorApply, isLoading, error } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    profilePicture: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'personal' | 'account'>('personal');

  // ─── Image handling ───────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError('Image must be smaller than 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setFormData(prev => ({ ...prev, profilePicture: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, profilePicture: '' }));
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Field change ─────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ─── Step 1 submit ────────────────────────────────────────────────────────
  const handlePersonalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';

    if (!formData.specialization) errors.specialization = 'Please select a specialization';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStep('account');
  };

  // ─── Step 2 submit ────────────────────────────────────────────────────────
  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    // Fallback avatar if no image uploaded
    const profilePicture =
      formData.profilePicture ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`;

    await instructorApply({ ...formData, profilePicture });

    const { error: submitError } = useAuthStore.getState();
    if (!submitError) {
      router.push('/instructor/login');
    }
  };

  // ─── Shared input classes ─────────────────────────────────────────────────
  const inputBase =
    'w-full h-full pl-12 pr-4 border border-[#b3b3b3] rounded-[6px] text-[14px] text-[#111111] placeholder-[#71717a] bg-white focus:outline-none focus:border-[#223D85] transition-colors';
  const inputErr = 'border-red-500';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans select-none">
      <div
        className="grid grid-cols-1 md:grid-cols-2 w-full bg-white shadow-2xl overflow-hidden rounded-none"
        style={{ maxWidth: '940px', minHeight: '600px' }}
      >
        {/* Left – hero image */}
        <div className="w-full relative min-h-[300px] md:min-h-full bg-[#eaeaea]">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
            alt="Instructor Teaching"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Right – form */}
        <div className="w-full bg-white flex flex-col justify-center items-center px-6 py-8 md:py-12">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 flex-shrink-0">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>

          {/* Heading */}
          <h2 className="text-[#111111] text-[24px] font-bold mb-6 tracking-tight text-center flex-shrink-0">
            {step === 'personal' ? 'Apply as Instructor' : 'Create Account'}
          </h2>

          {/* Global error */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px]" style={{ maxWidth: '310px' }}>
              <p className="text-red-600 text-[12px] text-center">{error}</p>
            </div>
          )}

          <div style={{ width: '310px' }} className="flex flex-col items-center w-full">

            {/* ── Step 1: Personal info ── */}
            {step === 'personal' ? (
              <form className="w-full flex flex-col gap-4" onSubmit={handlePersonalSubmit}>

                {/* Profile picture upload */}
                <div className="flex flex-col items-center gap-2">
                  {imagePreview ? (
                    <div className="relative w-20 h-20">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#223D85]"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <FiX size={11} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-full border-2 border-dashed border-[#b3b3b3] flex flex-col items-center justify-center cursor-pointer hover:border-[#223D85] transition-colors bg-[#f9f9f9]"
                    >
                      <FiUpload size={18} className="text-[#71717a] mb-1" />
                      <span className="text-[9px] text-[#71717a] text-center leading-tight px-1">Upload photo</span>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  <p className="text-[10px] text-[#71717a]">Optional · Max 10 MB · Any image format</p>
                  {imageError && <p className="text-red-500 text-[11px]">{imageError}</p>}
                </div>

                {/* Name */}
                <div>
                  <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                    <div className="absolute left-4 text-[#71717a] z-10 pointer-events-none">
                      <HiOutlineUser size={20} className="stroke-[1.5]" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputBase} ${fieldErrors.name ? inputErr : ''}`}
                    />
                  </div>
                  {fieldErrors.name && <p className="text-red-600 text-[12px] mt-1">{fieldErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                    <div className="absolute left-4 text-[#71717a] z-10 pointer-events-none">
                      <HiOutlineMail size={20} className="stroke-[1.5]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputBase} ${fieldErrors.email ? inputErr : ''}`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-red-600 text-[12px] mt-1">{fieldErrors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                    <div className="absolute left-4 text-[#71717a] z-10 pointer-events-none">
                      <HiOutlinePhone size={20} className="stroke-[1.5]" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${inputBase} ${fieldErrors.phone ? inputErr : ''}`}
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-red-600 text-[12px] mt-1">{fieldErrors.phone}</p>}
                </div>

                {/* Specialization */}
                <div>
                  <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={`w-full h-full pl-4 pr-10 border border-[#b3b3b3] rounded-[6px] text-[14px] bg-white focus:outline-none focus:border-[#223D85] transition-colors appearance-none cursor-pointer ${
                        formData.specialization ? 'text-[#111111]' : 'text-[#71717a]'
                      } ${fieldErrors.specialization ? 'border-red-500' : ''}`}
                    >
                      <option value="" disabled>Select Specialization</option>
                      {SPECIALIZATIONS.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 text-[#71717a] pointer-events-none">
                      <FiChevronDown size={18} />
                    </div>
                  </div>
                  {fieldErrors.specialization && (
                    <p className="text-red-600 text-[12px] mt-1">{fieldErrors.specialization}</p>
                  )}
                </div>

                {/* Continue */}
                <button
                  type="submit"
                  className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex items-center justify-center cursor-pointer"
                  style={{ height: '48px' }}
                >
                  Continue
                </button>

                <p className="text-center text-[13px] text-[#71717a] mt-1">
                  Already an instructor?{' '}
                  <Link href="/instructor/login" className="text-[#223D85] font-semibold hover:underline">
                    Login
                  </Link>
                </p>
              </form>

            ) : (
              /* ── Step 2: Account ── */
              <form className="w-full flex flex-col gap-4" onSubmit={handleAccountSubmit}>

                {/* Password */}
                <div>
                  <div className="relative w-full flex items-center flex-shrink-0" style={{ height: '48px' }}>
                    <div className="absolute left-4 text-[#71717a] z-10 pointer-events-none">
                      <FiLock size={20} strokeWidth={1.5} />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create Password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputBase} ${fieldErrors.password ? inputErr : ''}`}
                    />
                  </div>
                  {fieldErrors.password && <p className="text-red-600 text-[12px] mt-1">{fieldErrors.password}</p>}
                </div>

                {/* Summary of selected specialization */}
                <div className="w-full px-4 py-3 bg-[#f4f6fb] border border-[#dde3f0] rounded-[6px]">
                  <p className="text-[11px] text-[#71717a] mb-0.5 uppercase tracking-wider font-semibold">Specialization</p>
                  <p className="text-[13px] text-[#223D85] font-medium">{formData.specialization}</p>
                </div>

                {/* Back */}
                <button
                  type="button"
                  onClick={() => setStep('personal')}
                  className="w-full border border-[#b3b3b3] text-[#111111] font-semibold text-[14px] rounded-[6px] transition-colors flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5]"
                  style={{ height: '48px' }}
                >
                  ← Back
                </button>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#223D85] hover:bg-[#1A3069] text-white font-semibold text-[14px] rounded-[6px] transition-colors duration-200 tracking-wide flex items-center justify-center disabled:opacity-60 cursor-pointer"
                  style={{ height: '48px' }}
                >
                  {isLoading ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
