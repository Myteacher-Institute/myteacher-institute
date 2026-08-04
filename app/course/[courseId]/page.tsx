'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FiArrowLeft,
  FiPlay,
  FiClock,
  FiUsers,
  FiStar,
  FiCheck,
  FiAward,
  FiFilm,
  FiLayers,
  FiDownload,
  FiShield,
  FiLoader,
  FiArrowRight,
} from 'react-icons/fi';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { courseService, CoursePreview } from '@/services/course.service';
import { paymentService } from '@/services/payment.service';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format';

// Returns the affiliate code the visitor arrived with. The code is read from
// the URL (?affiliate=...) and persisted in sessionStorage so it survives the
// sign-in redirect and is attached to the payment transaction for the split.
const getAffiliateCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem('affiliate_ref');
  if (stored) return stored;
  const affiliate = new URLSearchParams(window.location.search).get('affiliate');
  if (affiliate) {
    sessionStorage.setItem('affiliate_ref', affiliate);
  }
  return affiliate;
};

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-xl ${className}`} />
);

export default function CoursePurchasePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const isDark = theme === 'dark';

  const [course, setCourse] = useState<CoursePreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const res = await courseService.getCoursePreview(courseId);
      if (res.status === 'success' && res.course) {
        setCourse(res.course);
      } else {
        setError(res.message || 'Course not found');
      }
    } catch (err) {
      console.error('Failed to load course preview:', err);
      setError('Failed to load course. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!isAuthenticated) {
      const affiliate = getAffiliateCode();
      const target = affiliate
        ? `/course/${courseId}?affiliate=${encodeURIComponent(affiliate)}`
        : `/course/${courseId}`;
      router.replace(
        `/get-started?redirect=${encodeURIComponent(target)}`
      );
      return;
    }
    const timer = setTimeout(() => loadCourse(), 0);
    return () => clearTimeout(timer);
  }, [isAuthenticated, courseId, router, loadCourse]);

  const handlePurchase = async () => {
    if (!course) return;
    setPaying(true);
    setPayError('');
    try {
      const res = await paymentService.createPayment({
        courseId: course._id,
        amount: course.price,
        redirectUrl: `${window.location.origin}/payment/callback`,
        affiliateId: getAffiliateCode() || undefined,
      });
      if (res.status === 'success' && res.paymentLink) {
        sessionStorage.removeItem('affiliate_ref');
        window.location.href = res.paymentLink;
        return;
      }
      if (/already purchased/i.test(res.message)) {
        setAlreadyPurchased(true);
      }
      setPayError(res.message || 'Could not start payment. Please try again.');
    } catch (err) {
      console.error('Create payment error:', err);
      setPayError('Could not start payment. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <span className="flex items-center gap-0.5 text-orange-500">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            size={14}
            className={i < fullStars || (i === fullStars && hasHalfStar) ? 'fill-current' : 'text-slate-300'}
          />
        ))}
      </span>
    );
  };

  // ---------- Skeleton state ----------
  if (loading && !course) {
    return (
      <div className={isDark ? 'min-h-screen bg-slate-900 font-sans' : 'min-h-screen bg-[#F8FAFC] font-sans'}>
        <header className={`sticky top-0 z-50 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
            <Skeleton className={`h-9 w-9 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <Skeleton className={`h-4 w-32 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <Skeleton className={`h-64 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className="mt-8 space-y-4">
                <Skeleton className={`h-8 w-3/4 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <Skeleton className={`h-4 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <Skeleton className={`h-4 w-5/6 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <Skeleton className={`h-4 w-2/3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              </div>
            </div>
            <div className="lg:col-span-4">
              <Skeleton className={`h-72 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---------- Error state ----------
  if (error && !course) {
    return (
      <div className={isDark ? 'min-h-screen bg-slate-900 font-sans' : 'min-h-screen bg-[#F8FAFC] font-sans'}>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className={`text-5xl font-black mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Oops!</div>
          <p className={`text-sm font-medium mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{error}</p>
          <button
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
          >
            <FiArrowLeft size={16} /> Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const cardStyle = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
  const textPrimary = isDark ? 'text-white' : 'text-[#0F1C2E]';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={isDark ? 'min-h-screen bg-slate-900 font-sans' : 'min-h-screen bg-[#F8FAFC] font-sans'}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/courses')}
              className={`flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#2563EB]'}`}
            >
              <FiArrowLeft size={18} /> Courses
            </button>
          </div>
          <button
            onClick={() => router.push('/student')}
            className={`text-sm font-bold transition-colors cursor-pointer ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#2563EB]'}`}
          >
            My Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Hero — MS Store install layout */}
        <section className={`rounded-3xl border shadow-sm p-6 md:p-10 ${cardStyle}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* App thumbnail */}
            <div className="lg:col-span-5">
              <div className={`relative aspect-video rounded-2xl overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <Image
                  src={course.previewThumbnail || FALLBACK_IMAGE}
                  alt={course.courseName}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover"
                />
                {course.previewVideos.length > 0 && (
                  <a
                    href={course.previewVideos[0].videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/10 group"
                  >
                    <span className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                      <FiPlay size={24} className="text-[#2563EB] ml-1" />
                    </span>
                  </a>
                )}
              </div>
            </div>

            {/* App info */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
                  Course
                </span>
                <span className={`flex items-center gap-1 text-xs font-semibold ${mutedText}`}>
                  {renderStars(course.averageRating || 0)}
                  <span className="ml-1">{course.averageRating || 'New'}</span>
                </span>
              </div>

              <h1 className={`text-3xl md:text-4xl font-black leading-tight mb-4 ${textPrimary}`}>
                {course.courseName}
              </h1>

              <p className={`text-sm md:text-base font-medium mb-6 ${textSecondary}`}>
                by <span className={isDark ? 'text-blue-300' : 'text-[#2563EB]'}>{course.instructorName || 'MyTeacher Institute'}</span>
              </p>

              <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8">
                <div className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
                  <FiFilm size={16} /> {course.lessons} lessons
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
                  <FiClock size={16} /> {course.duration} weeks
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${mutedText}`}>
                  <FiUsers size={16} /> Self-paced
                </div>
              </div>

              {/* Price + purchase (where MS Store shows Install) */}
              <div className={`rounded-2xl p-5 border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-[#F8FAFC] border-slate-100'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-3xl font-black ${textPrimary}`}>${course.price}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    <FiShield size={14} /> One-time payment
                  </span>
                </div>

                {alreadyPurchased ? (
                  <button
                    onClick={() => router.push('/student')}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer text-sm"
                  >
                    <FiCheck size={18} /> Course in your library
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={paying}
                    className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.99] shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {paying ? (
                      <>
                        <FiLoader size={18} className="animate-spin" /> Contacting payment gateway…
                      </>
                    ) : (
                      <>
                        Proceed with Payment <FiArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}

                {payError && (
                  <p className={`text-xs font-semibold text-center mt-3 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                    {payError}
                  </p>
                )}

                <p className={`text-center text-[11px] font-semibold mt-3 ${mutedText}`}>
                  Secure checkout powered by Flutterwave
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className={`mt-8 rounded-3xl border shadow-sm p-6 md:p-10 ${cardStyle}`}>
          <h2 className={`text-xl md:text-2xl font-black mb-4 ${textPrimary}`}>Overview</h2>
          <p className={`text-sm md:text-[15px] leading-relaxed whitespace-pre-line ${textSecondary}`}>
            {course.description}
          </p>

          {course.certificate && (
            <div className={`mt-6 flex items-center gap-2 text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <FiAward size={16} /> Certificate of completion included
            </div>
          )}
        </section>

        {/* What you get */}
        <section className={`mt-8 rounded-3xl border shadow-sm p-6 md:p-10 ${cardStyle}`}>
          <h2 className={`text-xl md:text-2xl font-black mb-6 ${textPrimary}`}>What you get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <FiPlay size={18} />, label: `${course.lessons} on-demand video lessons` },
              { icon: <FiLayers size={18} />, label: `${course.duration} weeks of structured learning` },
              { icon: <FiDownload size={18} />, label: 'Full lifetime access' },
              { icon: <FiAward size={18} />, label: 'Certificate of completion' },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm font-semibold rounded-xl px-4 py-3 border ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-[#F8FAFC] border-slate-100 text-slate-600'}`}
              >
                <span className={isDark ? 'text-blue-400' : 'text-[#2563EB]'}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </section>

        {/* Preview videos */}
        {course.previewVideos.length > 0 && (
          <section className={`mt-8 rounded-3xl border shadow-sm p-6 md:p-10 ${cardStyle}`}>
            <h2 className={`text-xl md:text-2xl font-black mb-6 ${textPrimary}`}>Course Preview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.previewVideos.map((video, i) => (
                <a
                  key={i}
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 rounded-xl px-4 py-4 border transition-colors ${isDark ? 'bg-slate-900 border-slate-700 hover:border-blue-500/50' : 'bg-[#F8FAFC] border-slate-100 hover:border-[#2563EB]/40'}`}
                >
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
                    <FiPlay size={15} className="ml-0.5" />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold truncate ${textPrimary}`}>
                      {video.videoTitle || `Preview ${i + 1}`}
                    </p>
                    <p className={`text-[11px] font-medium ${mutedText}`}>
                      {video.videoDuration ? `${Math.round(video.videoDuration / 60)} min` : 'Watch now'}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {course.courseRequirements.length > 0 && (
          <section className={`mt-8 rounded-3xl border shadow-sm p-6 md:p-10 ${cardStyle}`}>
            <h2 className={`text-xl md:text-2xl font-black mb-6 ${textPrimary}`}>Requirements</h2>
            <ul className="space-y-3">
              {course.courseRequirements.map((req, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm font-medium ${textSecondary}`}>
                  <FiCheck size={17} className={`mt-0.5 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  {req}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
