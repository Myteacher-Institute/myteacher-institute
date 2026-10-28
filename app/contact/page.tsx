"use client";

import { useState } from 'react';
import { useThemeStore } from '@/store/theme.store';

export default function ContactPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="py-20 px-6 max-w-6xl mx-auto font-sans">
        <h1 className={isDark ? "text-5xl font-black text-white tracking-tight leading-[1.1] mb-8" : "text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1] mb-8"}>
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`space-y-8 ${isDark ? "text-slate-300" : "text-[#4A5E7A]"}`}>
            <section>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
                Get in Touch
              </h2>
              <p className="text-xl leading-relaxed">
                Have questions? We're here to help. Fill out the form and we'll get back to you within 24 hours.
              </p>
            </section>

            <section>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
                Contact Information
              </h2>
              <div className="space-y-4 text-xl">
                <div>
                  <strong className={isDark ? "text-white" : "text-[#0F1C2E]"}>Email:</strong>
                  <p className="mt-1">support@myteacherinstitute.com</p>
                </div>
                <div>
                  <strong className={isDark ? "text-white" : "text-[#0F1C2E]"}>Phone:</strong>
                  <p className="mt-1">+1 (555) 123-4567</p>
                </div>
                <div>
                  <strong className={isDark ? "text-white" : "text-[#0F1C2E]"}>Address:</strong>
                  <p className="mt-1">
                    123 Education Street<br />
                    Learning City, LC 12345
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className={isDark ? "text-2xl font-bold text-white mb-4" : "text-2xl font-bold text-[#0F1C2E] mb-4"}>
                Office Hours
              </h2>
              <div className="space-y-2 text-xl">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </section>
          </div>

          <div>
            {submitted ? (
              <div className={isDark ? "bg-green-900/30 border border-green-700 p-8 rounded-2xl" : "bg-green-50 border border-green-200 p-8 rounded-2xl"}>
                <h3 className={isDark ? "text-2xl font-bold text-green-400 mb-2" : "text-2xl font-bold text-green-600 mb-2"}>
                  Message Sent!
                </h3>
                <p className={isDark ? "text-slate-300 text-xl" : "text-[#4A5E7A] text-xl"}>
                  Thank you for contacting us. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={isDark ? "bg-slate-800 p-8 rounded-2xl border border-slate-700" : "bg-white p-8 rounded-2xl border border-gray-100"}>
                <div className="space-y-6">
                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDark ? "text-white" : "text-[#0F1C2E]"}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-[#0F1C2E]"} focus:outline-none focus:border-[#1E40AF]`}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDark ? "text-white" : "text-[#0F1C2E]"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-[#0F1C2E]"} focus:outline-none focus:border-[#1E40AF]`}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDark ? "text-white" : "text-[#0F1C2E]"}`}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-[#0F1C2E]"} focus:outline-none focus:border-[#1E40AF]`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-base font-bold mb-2 ${isDark ? "text-white" : "text-[#0F1C2E]"}`}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border ${isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-gray-300 text-[#0F1C2E]"} focus:outline-none focus:border-[#1E40AF] resize-none`}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1E40AF] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
