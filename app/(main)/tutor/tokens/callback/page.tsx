"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiCheckCircle, FiXCircle, FiLoader } from "react-icons/fi";
import axiosInstance from "@/lib/axios";

function TokenPurchaseCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const tx_ref = searchParams.get('tx_ref');
      const transaction_id = searchParams.get('transaction_id');
      const paymentStatus = searchParams.get('status');

      console.log('Callback params:', { tx_ref, transaction_id, paymentStatus });

      if (!tx_ref) {
        setStatus('error');
        setMessage('Missing transaction reference');
        return;
      }

      // Allow verification even if transaction_id is missing
      // (Flutterwave may send different parameter names)
      if (!transaction_id) {
        console.warn('Transaction ID missing, proceeding with tx_ref only');
      }

      // Check for successful payment status
      if (paymentStatus && paymentStatus !== 'successful' && paymentStatus !== 'completed') {
        setStatus('error');
        setMessage(`Payment status: ${paymentStatus}`);
        return;
      }

      try {
        const params: { tx_ref: string; transaction_id?: string } = { tx_ref };
        if (transaction_id) {
          params.transaction_id = transaction_id;
        }

        const res = await axiosInstance.get('/api/ai-token/verify', { params });

        if (res.data.status === 'success') {
          setStatus('success');
          setMessage('Token purchase successful! Your tokens have been added to your account.');
          
          // Redirect to tutor page after 2 seconds
          setTimeout(() => {
            router.push('/tutor');
          }, 2000);
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Payment verification failed');
        }
      } catch (err: unknown) {
        const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to verify payment';
        console.error('Verification error:', err);
        setStatus('error');
        setMessage(errorMsg);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <FiLoader className="animate-spin text-blue-600" size={48} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verifying Payment...</h2>
            <p className="text-gray-600 dark:text-slate-400 text-center">Please wait while we verify your token purchase.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Successful!</h2>
            <p className="text-gray-600 dark:text-slate-400 text-center">{message}</p>
            <p className="text-sm text-gray-500 dark:text-slate-500">Redirecting to tutor page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FiXCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Failed</h2>
            <p className="text-gray-600 dark:text-slate-400 text-center">{message}</p>
            <button
              onClick={() => router.push('/tutor')}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Tutor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TokenPurchaseCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <FiLoader className="animate-spin text-blue-600" size={48} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loading...</h2>
          </div>
        </div>
      </div>
    }>
      <TokenPurchaseCallbackContent />
    </Suspense>
  );
}