"use client";

import React, { useState, useEffect } from "react";
import { FiCpu, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import axiosInstance from "@/lib/axios";

interface TokenPackage {
  tokens: number;
  price: number;
  bonus: number;
  total_tokens: number;
  effective_rate: number;
}

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentBalance: number;
  redirectUrl?: string;
}

export const TokenPurchaseModal: React.FC<TokenPurchaseModalProps> = ({
  isOpen,
  onClose,
  isDark,
  currentBalance,
  redirectUrl,
}) => {
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [purchasing, setPurchasing] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchPackages = async () => {
    try {
      const res = await axiosInstance.get('/api/ai-token/packages');
      if (res.data.status === 'success') {
        setPackages(res.data.packages);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
      setError('Failed to load token packages');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  const handlePurchase = async (pkg: TokenPackage) => {
    setPurchasing(pkg.tokens);
    setError("");

    try {
      const res = await axiosInstance.post('/api/ai-token/purchase', {
        tokens: pkg.tokens,
        amount: pkg.price,
        redirect_url: redirectUrl
      });

      if (res.data.status === 'success' && res.data.paymentLink) {
        // Redirect to Flutterwave payment
        window.location.assign(res.data.paymentLink);
      } else {
        setError(res.data.message || 'Failed to create payment');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to initiate purchase';
      setError(message);
    } finally {
      setPurchasing(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCpu className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Buy Tokens
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100'}`}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Current Balance */}
        <div className={`p-6 border-b ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiCpu className={isDark ? 'text-blue-400' : 'text-blue-600'} size={20} />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Current Balance
              </span>
            </div>
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentBalance.toLocaleString()} tokens
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="text-red-600" size={18} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Token Packages */}
        <div className="p-6">
          <h3 className={`font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Available Packages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`rounded-xl border p-5 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-700 border-slate-600 hover:border-blue-500' 
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
                onClick={() => handlePurchase(pkg)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-purple-100' : index === 2 ? 'bg-green-100' : index === 3 ? 'bg-orange-100' : 'bg-pink-100'}`}>
                      <FiCpu className={index === 0 ? 'text-blue-600' : index === 1 ? 'text-purple-600' : index === 2 ? 'text-green-600' : index === 3 ? 'text-orange-600' : 'text-pink-600'} size={18} />
                    </div>
                    <div>
                      <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {pkg.total_tokens.toLocaleString()} Tokens
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {pkg.tokens.toLocaleString()} {pkg.bonus > 0 && `+ ${pkg.bonus.toLocaleString()} bonus`}
                      </div>
                    </div>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className={`px-2 py-1 rounded-full text-[10px] font-semibold ${isDark ? 'bg-green-900/40 text-green-300' : 'bg-green-100 text-green-700'}`}>
                      +{pkg.bonus.toLocaleString()} Bonus
                    </div>
                  )}
                </div>

                <div className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(pkg.price)}
                </div>

                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mb-4`}>
                  Effective rate: {formatCurrency(pkg.effective_rate)} per token
                </div>

                <button
                  disabled={purchasing === pkg.tokens}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    purchasing === pkg.tokens
                      ? 'bg-blue-600 text-white opacity-60 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {purchasing === pkg.tokens ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={18} />
                      Purchase Now
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t">
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-semibold transition-colors ${
              isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};