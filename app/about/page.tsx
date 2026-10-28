"use client";

import { useThemeStore } from '@/store/theme.store';

export default function AboutPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="py-20 px-6 max-w-6xl mx-auto font-sans">
        <h1 className={isDark ? "text-5xl font-black text-white tracking-tight leading-[1.1] mb-8" : "text-5xl font-black text-[#0F1C2E] tracking-tight leading-[1.1] mb-8"}>
          About Myteacher Institute
        </h1>

        <div className={`space-y-12 ${isDark ? "text-slate-300" : "text-[#4A5E7A]"}`}>
          <section>
            <h2 className={isDark ? "text-3xl font-bold text-white mb-4" : "text-3xl font-bold text-[#0F1C2E] mb-4"}>
              Our Mission
            </h2>
            <p className="text-xl leading-relaxed">
              At Myteacher Institute, we're on a mission to democratize education by making high-quality digital skills training accessible to everyone. We believe that talent is universal, but opportunity is not – and we're here to bridge that gap.
            </p>
          </section>

          <section>
            <h2 className={isDark ? "text-3xl font-bold text-white mb-4" : "text-3xl font-bold text-[#0F1C2E] mb-4"}>
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700" : "bg-white p-6 rounded-2xl border border-gray-100"}>
                <h3 className={isDark ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-[#0F1C2E] mb-2"}>
                  Quality Education
                </h3>
                <p className="text-base leading-relaxed">
                  Industry-relevant courses designed and taught by experts who have real-world experience.
                </p>
              </div>
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700" : "bg-white p-6 rounded-2xl border border-gray-100"}>
                <h3 className={isDark ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-[#0F1C2E] mb-2"}>
                  AI-Powered Learning
                </h3>
                <p className="text-base leading-relaxed">
                  Personalized AI tutors that adapt to your learning style and pace for maximum effectiveness.
                </p>
              </div>
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700" : "bg-white p-6 rounded-2xl border border-gray-100"}>
                <h3 className={isDark ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-[#0F1C2E] mb-2"}>
                  Mentorship Programs
                </h3>
                <p className="text-base leading-relaxed">
                  Connect with industry mentors who provide guidance, feedback, and career support.
                </p>
              </div>
              <div className={isDark ? "bg-slate-800 p-6 rounded-2xl border border-slate-700" : "bg-white p-6 rounded-2xl border border-gray-100"}>
                <h3 className={isDark ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-[#0F1C2E] mb-2"}>
                  Career Support
                </h3>
                <p className="text-base leading-relaxed">
                  From resume building to interview preparation, we support your journey to employment.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className={isDark ? "text-3xl font-bold text-white mb-4" : "text-3xl font-bold text-[#0F1C2E] mb-4"}>
              Our Values
            </h2>
            <ul className="space-y-4 text-xl">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Accessibility:</strong> Education should be affordable and accessible to all.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Excellence:</strong> We maintain the highest standards in course quality and instruction.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Innovation:</strong> We continuously evolve our teaching methods and technology.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Community:</strong> We foster a supportive learning environment for all students.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className={isDark ? "text-3xl font-bold text-white mb-4" : "text-3xl font-bold text-[#0F1C2E] mb-4"}>
              Our Impact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className={isDark ? "text-5xl font-black text-white mb-2" : "text-5xl font-black text-[#0F1C2E] mb-2"}>
                  10,000+
                </div>
                <p className="text-base">Students Enrolled</p>
              </div>
              <div className="text-center">
                <div className={isDark ? "text-5xl font-black text-white mb-2" : "text-5xl font-black text-[#0F1C2E] mb-2"}>
                  500+
                </div>
                <p className="text-base">Courses Available</p>
              </div>
              <div className="text-center">
                <div className={isDark ? "text-5xl font-black text-white mb-2" : "text-5xl font-black text-[#0F1C2E] mb-2"}>
                  95%
                </div>
                <p className="text-base">Job Placement Rate</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className={isDark ? "text-3xl font-bold text-white mb-4" : "text-3xl font-bold text-[#0F1C2E] mb-4"}>
              Contact Us
            </h2>
            <p className="text-xl leading-relaxed">
              Have questions? We'd love to hear from you. Reach out to us at <a href="mailto:support@myteacherinstitute.com" className="text-[#1E40AF] hover:underline">support@myteacherinstitute.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
