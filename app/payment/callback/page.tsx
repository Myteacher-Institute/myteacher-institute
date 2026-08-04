'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowLeft } from 'react-icons/fi';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { paymentService } from '@/services/payment.service';

type CallbackState = 'processing' | 'success' | 'failed' | 'cancelled';

export default function PaymentCallbackPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const isDark = theme === 'dark';

  const [state, setState] = useState<CallbackState>('processing');
  const [message, setMessage] = useState('Verifying your payment…');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      const txRef = params.get('tx_ref');
      const transactionId = params.get('transaction_id');

      if (!txRef) {
        router.replace('/courses');
        return;
      }

      // tx_ref format: MYT-<userId>-<courseId>-<timestamp>-<random>
      const parts = txRef.split('-');
      if (parts.length >= 3) setCourseId(parts[2]);

      if (status === 'cancelled') {
        setState('cancelled');
        setMessage('Your payment was cancelled. No charge was made.');
        return;
      }

      if (status === 'failed') {
        setState('failed');
        setMessage('Your payment failed. Please try again.');
        return;
      }

      const verify = async () => {
        try {
          let res;
          if (status === 'successful' && transactionId) {
            res = await paymentService.verifyPayment({
              transaction_id: transactionId,
              tx_ref: txRef,
            });
          } else {
            res = await paymentService.getPaymentStatus(
              txRef,
              transactionId || undefined
            );
          }

          const txStatus = res.transaction?.status;
          if (res.status === 'success' && txStatus === 'successful') {
            setState('success');
            setMessage('Payment confirmed! Redirecting you to your dashboard…');
            setTimeout(() => router.replace('/student'), 1500);
          } else if (txStatus === 'cancelled') {
            setState('cancelled');
            setMessage('Your payment was cancelled. No charge was made.');
          } else if (txStatus === 'failed') {
            setState('failed');
            setMessage('Your payment failed. Please try again.');
          } else {
            setState('failed');
            setMessage(res.message || 'Payment could not be verified.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          if (!isAuthenticated) {
            const redirect = encodeURIComponent(window.location.href);
            router.replace(`/get-started?redirect=${redirect}`);
            return;
          }
          setState('failed');
          setMessage(
            'We could not verify your payment right now. Please check your dashboard shortly.'
          );
        }
      };

      verify();
    }, 0);

    return () => clearTimeout(timer);
  }, [router, isAuthenticated]);

  const isDarkBg = isDark;
  const containerCls = isDarkBg
    ? 'min-h-screen bg-slate-900 font-sans'
    : 'min-h-screen bg-[#F8FAFC] font-sans';
  const cardCls = isDarkBg
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-100';

  return (
    <div className={containerCls}>
      <main className="max-w-lg mx-auto px-6 py-28">
        <div className={`rounded-3xl border shadow-sm p-8 md:p-10 text-center ${cardCls}`}>
          {state === 'processing' && (
            <>
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center bg-blue-500/15 mb-6">
                <FiLoader size={26} className="text-[#2563EB] animate-spin" />
              </div>
              <h1 className={`text-xl font-black mb-2 ${isDarkBg ? 'text-white' : 'text-[#0F1C2E]'}`}>
                Processing payment
              </h1>
              <p className={`text-sm font-medium ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                {message}
              </p>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center bg-emerald-500/15 mb-6">
                <FiCheckCircle size={28} className="text-emerald-500" />
              </div>
              <h1 className={`text-xl font-black mb-2 ${isDarkBg ? 'text-white' : 'text-[#0F1C2E]'}`}>
                Payment successful
              </h1>
              <p className={`text-sm font-medium ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                {message}
              </p>
            </>
          )}

          {state === 'cancelled' && (
            <>
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center bg-amber-500/15 mb-6">
                <FiXCircle size={28} className="text-amber-500" />
              </div>
              <h1 className={`text-xl font-black mb-2 ${isDarkBg ? 'text-white' : 'text-[#0F1C2E]'}`}>
                Payment cancelled
              </h1>
              <p className={`text-sm font-medium mb-8 ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                {message}
              </p>
              <button
                onClick={() => router.push(courseId ? `/course/${courseId}` : '/courses')}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                <FiArrowLeft size={16} /> Back to Course
              </button>
            </>
          )}

          {state === 'failed' && (
            <>
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center bg-rose-500/15 mb-6">
                <FiXCircle size={28} className="text-rose-500" />
              </div>
              <h1 className={`text-xl font-black mb-2 ${isDarkBg ? 'text-white' : 'text-[#0F1C2E]'}`}>
                Payment failed
              </h1>
              <p className={`text-sm font-medium mb-8 ${isDarkBg ? 'text-slate-400' : 'text-slate-500'}`}>
                {message}
              </p>
              <button
                onClick={() => router.push(courseId ? `/course/${courseId}` : '/courses')}
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                <FiArrowLeft size={16} /> Back to Course
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
