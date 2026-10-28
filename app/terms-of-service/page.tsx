"use client";

import { useThemeStore } from '@/store/theme.store';

export default function TermsOfServicePage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="py-20 px-6 max-w-4xl mx-auto font-sans">
        <h1 className={isDark ? "text-5xl font-black text-white tracking-tight leading-[1.1] mb-8" : "text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1] mb-8"}>
          Terms of Service
        </h1>

        <div className={`space-y-8 ${isDark ? "text-slate-300" : "text-[#4A5E7A]"}`}>
          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              1. Acceptance of Terms
            </h2>
            <p className="text-base leading-relaxed">
              By accessing and using Myteacher Institute's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              2. User Accounts
            </h2>
            <p className="text-base leading-relaxed mb-4">
              You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              3. Course Content
            </h2>
            <p className="text-base leading-relaxed mb-4">
              All course materials, including videos, text, and other resources, are protected by copyright. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              4. Payment and Refunds
            </h2>
            <p className="text-base leading-relaxed mb-4">
              All payments are processed through secure payment gateways. Refunds are subject to our refund policy, which may vary by course. Please review individual course policies before enrolling.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              5. Code of Conduct
            </h2>
            <p className="text-base leading-relaxed mb-4">
              Users must maintain respectful and professional behavior in all interactions. Harassment, discrimination, or inappropriate behavior will result in account termination.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              6. Limitation of Liability
            </h2>
            <p className="text-base leading-relaxed mb-4">
              Myteacher Institute shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              7. Changes to Terms
            </h2>
            <p className="text-base leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
              8. Contact Information
            </h2>
            <p className="text-base leading-relaxed">
              For questions about these Terms of Service, please contact us at support@myteacherinstitute.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className={isDark ? "text-slate-400 text-sm" : "text-slate-500 text-sm"}>
            Last updated: January 2024
          </p>
        </div>
      </div>
    </main>
  );
}
