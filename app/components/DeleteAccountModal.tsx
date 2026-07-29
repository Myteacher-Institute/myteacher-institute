"use client";

import { useState } from "react";
import { FiLoader, FiX, FiAlertTriangle, FiCheck, FiArrowRight } from "react-icons/fi";
import axiosInstance from "@/lib/axios";
import { useThemeStore } from "@/store/theme.store";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onSuccess }: DeleteAccountModalProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<"confirm" | "otp" | "success">("confirm");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [reason, setReason] = useState("");

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post('/api/instructor/account/send-delete-otp', { reason });
      if (res.data.status === 'success') {
        setStep("otp");
      } else {
        setError(res.data.message || "Failed to send OTP");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axiosInstance.delete('/api/instructor/account', { data: { otp, reason } });
      if (res.data.status === 'success') {
        setStep("success");
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(res.data.message || "Failed to delete account");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={isDark ? "relative bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200" : "relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        {/* Step 1: Confirmation */}
        {step === "confirm" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-red-600">
              <div className={isDark ? "p-3 bg-red-900/30 rounded-xl" : "p-3 bg-red-100 rounded-xl"}>
                <FiAlertTriangle size={24} />
              </div>
              <h3 className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold"}>Delete Account</h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All your data including courses, students, and earnings will be permanently deleted.
              </p>
            </div>

            <div>
              <label className={isDark ? "block text-sm font-medium text-white mb-2" : "block text-sm font-medium text-slate-700 mb-2"}>
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className={isDark ? "w-full px-4 py-3 rounded-xl border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none bg-slate-700" : "w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"}
                placeholder="Why are you deleting your account?"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-sm">
                <FiX size={16} />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className={isDark ? "flex-1 px-4 py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-slate-700 transition-colors disabled:opacity-50" : "flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"}
              >
                Cancel
              </button>
              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <FiLoader className="animate-spin" size={20} /> : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: OTP Input */}
        {step === "otp" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-blue-600">
              <div className={isDark ? "p-3 bg-blue-900/30 rounded-xl" : "p-3 bg-blue-100 rounded-xl"}>
                <FiCheck size={24} />
              </div>
              <h3 className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold"}>Enter OTP</h3>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-blue-700 text-sm">
                A 6-digit OTP has been sent to your email. Enter it below to confirm account deletion.
              </p>
            </div>

            <div>
              <label className={isDark ? "block text-sm font-medium text-white mb-2" : "block text-sm font-medium text-slate-700 mb-2"}>
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOTPChange}
                maxLength={6}
                className={isDark ? "w-full px-4 py-3 rounded-xl border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center text-2xl font-bold tracking-widest bg-slate-700" : "w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center text-2xl font-bold tracking-widest"}
                placeholder="000000"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-600 text-sm">
                <FiX size={16} />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("confirm")}
                disabled={isLoading}
                className={isDark ? "flex-1 px-4 py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2" : "flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"}
              >
                <FiArrowRight size={16} className="rotate-180" />
                Back
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading || otp.length !== 6}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <FiLoader className="animate-spin" size={20} /> : "Confirm Deletion"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-3 text-green-600">
              <div className={isDark ? "p-3 bg-green-900/30 rounded-xl" : "p-3 bg-green-100 rounded-xl"}>
                <FiCheck size={32} />
              </div>
            </div>

            <h3 className={isDark ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>Account Deleted</h3>

            <p className={isDark ? "text-slate-300" : "text-slate-600"}>
              Your account has been successfully deleted. You will be redirected shortly.
            </p>

            <div className="flex items-center justify-center">
              <FiLoader className="animate-spin text-slate-400" size={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
