'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiCheck,
  FiClock,
  FiFilm,
  FiLock,
  FiCheckCircle,
  FiZap,
  FiStar,
  FiCode,
  FiDownload,
  FiFileText,
  FiBookOpen,
  FiCopy,
} from 'react-icons/fi';
import { useThemeStore } from '@/store/theme.store';
import { courseService } from '@/services/course.service';
import { RateCourseModal } from '@/app/components/constants/Students/RateCourseModal';
import type { Course, CourseVideo, Quiz } from '@/types';

const getYouTubeEmbedUrl = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const Skeleton: React.FC<{ className: string }> = ({ className }) => (
  <div className={`animate-pulse rounded-xl ${className}`} />
);

export default function LearnCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notPurchased, setNotPurchased] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // -1 means showing course overview
  const [completed, setCompleted] = useState<Set<number>>(() => {
    if (typeof window === 'undefined' || !courseId) return new Set();
    try {
      const raw = localStorage.getItem(`learn_completed_${courseId}`);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const hasAutoSelectedPreview = useRef(false);

  // Check if user has already rated this course (from localStorage)
  const hasRatedInStorage = typeof window !== 'undefined' && courseId ? localStorage.getItem(`has_rated_${courseId}`) : null;

  // Fall back to a single "Course Content" chapter for courses created before
  // the chapters feature landed.
  const chapters = useMemo(() => {
    if (!course) return [];
    return course.chapters?.length
      ? course.chapters.map(ch => ({
          ...ch,
          videos: [...ch.videos].sort((a, b) => {
            // Show preview videos first
            if (a.isPreview && !b.isPreview) return -1;
            if (!a.isPreview && b.isPreview) return 1;
            return 0;
          })
        }))
      : course.courseVideos?.length
        ? [{ 
            title: 'Course Content', 
            explanation: course.description || '', 
            videos: [...course.courseVideos].sort((a, b) => {
              // Show preview videos first
              if (a.isPreview && !b.isPreview) return -1;
              if (!a.isPreview && b.isPreview) return 1;
              return 0;
            }), 
            programmingCodes: course.programmingCodes || [], 
            assets: course.assets || [], 
            quizzes: course.quizzes || [] 
          }]
        : [];
  }, [course]);

  const loadCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    setNotPurchased(false);
    try {
      // my-courses only returns courses the user has actually purchased, so
      // it both fetches the content and enforces ownership in one call.
      const res = await courseService.getMyCourses();
      if (res.status !== 'success' || !res.courses) {
        setError(res.message || 'Could not load this course.');
        return;
      }
      const found = res.courses.find((c) => c._id === courseId);
      if (!found) {
        setNotPurchased(true);
        return;
      }
      setCourse(found);
      setActiveIndex(-1); // Show course overview first, will auto-select preview after render
    } catch (err) {
      console.error('Failed to load course:', err);
      setError('Failed to load course. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const timer = setTimeout(() => loadCourse(), 0);
    return () => clearTimeout(timer);
  }, [loadCourse]);

  // Auto-select first preview video when course loads
  useEffect(() => {
    if (course && !hasAutoSelectedPreview.current && chapters.length > 0) {
      hasAutoSelectedPreview.current = true;
      // Check if there are any preview videos
      const allVideos = chapters.flatMap((ch, ci) =>
        ch.videos.map((video, vi) => ({ ci, vi, video }))
      );
      const firstPreviewIdx = allVideos.findIndex(item => item.video.isPreview);
      if (firstPreviewIdx >= 0) {
        // Use setTimeout to avoid cascading renders
        setTimeout(() => setActiveIndex(firstPreviewIdx), 0);
      }
    }
  }, [course, chapters]);

  const lessons: { ci: number; vi: number; video: CourseVideo }[] = chapters.flatMap((ch, ci) =>
    ch.videos.map((video, vi) => ({ ci, vi, video }))
  );
  const activeLesson = activeIndex >= 0 ? lessons[activeIndex] ?? null : null;
  const activeVideo = activeLesson?.video ?? null;
  const embedUrl = activeVideo ? getYouTubeEmbedUrl(activeVideo.videoUrl) : null;

  // Calculate percentComplete early (before early returns) for use in useEffect
  const percentComplete = lessons.length
    ? Math.round((completed.size / lessons.length) * 100)
    : 0;

  // Show rating modal when progress > 20% and user hasn't rated yet
  useEffect(() => {
    if (percentComplete > 20 && !hasRatedInStorage && !hasRated && !showRateModal) {
      // Use setTimeout to avoid cascading renders
      setTimeout(() => setShowRateModal(true), 0);
    }
  }, [percentComplete, hasRatedInStorage, hasRated, showRateModal, courseId]);

  const toggleComplete = (idx: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      try {
        if (courseId) localStorage.setItem(`learn_completed_${courseId}`, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const goPrev = () => {
    setActiveIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goNext = () => {
    setActiveIndex((i) => Math.min(lessons.length - 1, i + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizAnswer = (quizIndex: string | number, questionIndex: number, answer: string) => {
    const key = `${String(quizIndex)}-${questionIndex}`;
    setQuizAnswers(prev => ({ ...prev, [key]: answer }));
  };

  const submitQuiz = (quizIndex: string | number, quiz: Quiz): number => {
    let correct = 0;
    quiz.questions.forEach((q, qi) => {
      const key = `${String(quizIndex)}-${qi}`;
      if (quizAnswers[key] === q.correctAnswer) {
        correct++;
      }
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    setQuizScores(prev => ({ ...prev, [String(quizIndex)]: score }));
    setShowQuizResults(prev => ({ ...prev, [quizIndex]: true }));
    return score;
  };

  const copyCode = (code: string, codeId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const cardStyle = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';
  const textPrimary = isDark ? 'text-white' : 'text-[#0F1C2E]';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-500';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  // ---------- Skeleton state ----------
  if (loading && !course) {
    return (
      <div className={isDark ? 'min-h-screen bg-slate-900 font-sans' : 'min-h-screen bg-[#F8FAFC] font-sans'}>
        <header className={`sticky top-0 z-50 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
            <Skeleton className={`h-9 w-9 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <Skeleton className={`h-4 w-48 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-9">
              <Skeleton className={`h-72 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <div className="mt-6 space-y-3">
                <Skeleton className={`h-6 w-1/2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <Skeleton className={`h-4 w-2/3 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <Skeleton className={`h-96 w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
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
            onClick={() => router.push('/student')}
            className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
          >
            <FiArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ---------- Not purchased state ----------
  if (notPurchased) {
    return (
      <div className={isDark ? 'min-h-screen bg-slate-900 font-sans' : 'min-h-screen bg-[#F8FAFC] font-sans'}>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400'}`}>
            <FiLock size={28} />
          </div>
          <div className={`text-3xl font-black mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Course not in your library</div>
          <p className={`text-sm font-medium mb-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            You have not purchased this course yet. Enroll to start learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push(`/course/${courseId}`)}
              className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              Enroll in Course
            </button>
            <button
              onClick={() => router.push('/courses')}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer border ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const instructorName = course.instructorDetails?.name || 'Instructor';
  const isActiveComplete = activeLesson ? completed.has(activeIndex) : false;

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!courseId) return;
    
    try {
      const res = await courseService.rateCourse(courseId, rating, comment);
      if (res.status === 'success') {
        setHasRated(true);
        localStorage.setItem(`has_rated_${courseId}`, 'true');
        // Refresh course data to get updated rating
        loadCourse();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <div className={isDark ? 'min-h-screen bg-slate-900 font-sans' : 'min-h-screen bg-[#F8FAFC] font-sans'}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => router.push('/student')}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors cursor-pointer shrink-0 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[#2563EB]'}`}
            >
              <FiArrowLeft size={15} />
            </button>
            <span className={`text-xs font-medium truncate ${mutedText}`}>
              myteacher.institute/course/{course.courseName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
            </span>
            {course.instructorDetails?.name && (
              <span className={`hidden md:flex items-center gap-2 shrink-0 ml-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold uppercase ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-[#2563EB]/10 text-[#2563EB]'}`}>
                  {instructorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </span>
                <span className="text-xs font-semibold">{instructorName}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => activeLesson && toggleComplete(activeIndex)}
              disabled={!activeLesson}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
                isActiveComplete
                  ? isDark
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-emerald-600 text-white'
                  : isDark
                    ? 'bg-blue-500/15 text-blue-300 hover:bg-blue-500/25'
                    : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
              }`}
            >
              {isActiveComplete ? <FiCheckCircle size={14} /> : <FiCheck size={14} />}
              {isActiveComplete ? 'Completed' : 'Mark as Complete'}
            </button>
            <div className={`flex items-center rounded-lg overflow-hidden border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <button
                onClick={goPrev}
                disabled={activeIndex === -1}
                aria-label="Previous lesson"
                className={`p-1.5 transition-colors cursor-pointer disabled:opacity-40 ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={goNext}
                disabled={activeIndex >= lessons.length - 1}
                aria-label="Next lesson"
                className={`p-1.5 transition-colors cursor-pointer disabled:opacity-40 ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-8">
        {/* Course content sidebar */}
        <aside className="lg:w-80 shrink-0">
          <div 
            className={`rounded-2xl border shadow-sm p-4 ${cardStyle} lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-hide`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <h2 className={`flex items-center justify-between text-base font-black mb-1 ${textPrimary}`}>
              <span className="flex items-center gap-2"><FiFilm size={16} /> Course Content</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                {percentComplete}% done
              </span>
            </h2>
            <div className={`h-1.5 rounded-full mb-4 overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <div className="h-full bg-[#2563EB] transition-all" style={{ width: `${percentComplete}%` }} />
            </div>

            {/* Course Overview Button */}
            <button
              onClick={() => {
                setActiveIndex(-1);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              }}
              className={`w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer mb-4 ${
                activeIndex === -1
                  ? isDark
                    ? 'bg-blue-500/15'
                    : 'bg-[#2563EB]/10'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className={`mt-1 shrink-0 ${activeIndex === -1 ? 'text-[#2563EB]' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <FiBookOpen size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold leading-snug ${activeIndex === -1 ? textPrimary : mutedText}`}>
                  Course Overview
                </p>
                <p className={`text-xs ${mutedText}`}>Course description and details</p>
              </div>
            </button>

            {chapters.length === 0 ? (
              <p className={`text-sm ${mutedText}`}>No lessons available yet.</p>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter, ci) => {
                  const chapterStart = lessons.findIndex((l) => l.ci === ci);
                  const chapterVideos = lessons.filter((l) => l.ci === ci);
                  const chapterCompleted = chapterStart >= 0 && chapterVideos.every((l) => completed.has(chapterStart + l.vi));
                  const hasExtraContent = chapter.programmingCodes?.length > 0 || chapter.assets?.length > 0 || chapter.quizzes?.length > 0;
                  
                  return (
                    <div key={ci}>
                      <div className="flex items-center gap-2 mb-1.5">
                        {chapterCompleted ? (
                          <FiCheckCircle size={15} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
                        ) : (
                          <span className={`w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
                        )}
                        <p className={`text-sm font-bold ${textPrimary}`}>{chapter.title || `Chapter ${ci + 1}`}</p>
                        <span className={`text-xs font-semibold ml-auto shrink-0 ${mutedText}`}>
                          {chapter.videos.length} lessons
                        </span>
                      </div>
                      {chapter.explanation && (
                        <p className={`text-xs mb-2 line-clamp-2 ${mutedText}`}>{chapter.explanation}</p>
                      )}
                      {hasExtraContent && (
                        <div className="flex items-center gap-2 mb-2">
                          {chapter.programmingCodes?.length > 0 && (
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                              <FiCode size={11} className="inline mr-1" /> {chapter.programmingCodes.length}
                            </span>
                          )}
                          {chapter.assets?.length > 0 && (
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-600'}`}>
                              <FiDownload size={11} className="inline mr-1" /> {chapter.assets.length}
                            </span>
                          )}
                          {chapter.quizzes?.length > 0 && (
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-600'}`}>
                              <FiFileText size={11} className="inline mr-1" /> {chapter.quizzes.length}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="space-y-1">
                        {chapter.videos.map((video, vi) => {
                          const globalIdx = chapterStart + vi;
                          const isActive = globalIdx === activeIndex;
                          const isDone = completed.has(globalIdx);
                          return (
                            <button
                              key={vi}
                              onClick={() => {
                                setActiveIndex(globalIdx);
                                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                              }}
                              className={`w-full flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors cursor-pointer ${
                                isActive
                                  ? isDark
                                    ? 'bg-blue-500/15'
                                    : 'bg-[#2563EB]/10'
                                  : 'hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              {isDone ? (
                                <FiCheckCircle size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                              ) : (
                                <FiPlay
                                  size={14}
                                  className={`mt-1 shrink-0 ${isActive ? 'text-[#2563EB]' : isDark ? 'text-slate-500' : 'text-slate-400'}`}
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm font-semibold leading-snug ${isActive ? textPrimary : mutedText}`}>
                                  {video.videoTitle || `Lesson ${vi + 1}`}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {video.isPreview && (
                                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                                      Preview
                                    </span>
                                  )}
                                  <span className={`text-xs font-medium flex items-center gap-0.5 ${mutedText}`}>
                                    <FiClock size={10} /> {formatDuration(video.videoDuration) || '—'}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <section className="flex-1 min-w-0 space-y-6">
          {activeIndex >= 0 ? (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                    Lesson {activeIndex + 1} of {lessons.length}
                  </span>
                  {activeVideo?.isPreview && (
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                      Preview
                    </span>
                  )}
                </div>
                <h1 className={`text-2xl md:text-3xl font-black leading-tight ${textPrimary}`}>
                  {activeVideo?.videoTitle || 'Welcome to the course'}
                </h1>
                <p className={`text-sm font-medium flex items-center gap-1.5 mt-1 ${mutedText}`}>
                  <FiClock size={14} /> {activeVideo ? (formatDuration(activeVideo.videoDuration) || 'Self-paced') : 'Self-paced'}
                </p>
              </div>
              <button
                onClick={() => activeLesson && toggleComplete(activeIndex)}
                disabled={!activeLesson}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-base font-bold transition-all cursor-pointer disabled:opacity-50 shadow-sm ${
                  isActiveComplete
                    ? isDark
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isDark
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                }`}
              >
                {isActiveComplete ? <FiCheckCircle size={16} /> : <FiCheck size={16} />}
                {isActiveComplete ? 'Marked as Complete' : 'Mark as Complete'}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                    Course Overview
                  </span>
                </div>
                <h1 className={`text-2xl md:text-3xl font-black leading-tight ${textPrimary}`}>
                  {course.courseName}
                </h1>
                <p className={`text-sm font-medium flex items-center gap-1.5 mt-1 ${mutedText}`}>
                  {lessons.length} lessons · {chapters.length} chapters · {course.duration} hours
                </p>
              </div>
            </div>
          )}

          {/* Video player - only show when viewing a lesson */}
          {activeIndex >= 0 && (
            <div className={`rounded-2xl border shadow-sm p-3 md:p-4 ${cardStyle}`}>
              <div className="aspect-video rounded-xl overflow-hidden bg-black dark:border-slate-700 border-slate-200">
                {embedUrl ? (
                  <iframe
                    key={activeVideo?.videoUrl}
                    src={embedUrl}
                    title={activeVideo?.videoTitle || 'Course video'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : activeVideo ? (
                  <video src={activeVideo.videoUrl} controls className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-500">
                    <FiPlay size={40} />
                    <p className="text-sm font-semibold">No videos in this course yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Course Overview - Always show description first */}
          {activeIndex === -1 && course?.description && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiBookOpen size={22} /> Course Overview
              </h2>
              <div
                className={`prose max-w-none text-base leading-relaxed rich-body ${textSecondary}`}
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </div>
          )}

          {/* Chapter Explanation */}
          {activeIndex >= 0 && activeLesson && chapters[activeLesson.ci]?.explanation && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiBookOpen size={22} /> Chapter Explanation
              </h2>
              <div
                className={`prose max-w-none text-base leading-relaxed rich-body ${textSecondary}`}
                dangerouslySetInnerHTML={{ __html: chapters[activeLesson.ci].explanation || '' }}
              />
            </div>
          )}

          {/* Programming Codes */}
          {activeIndex >= 0 && activeLesson && chapters[activeLesson.ci]?.programmingCodes && chapters[activeLesson.ci].programmingCodes.length > 0 && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiCode size={22} /> Programming Codes
              </h2>
              <div className="space-y-4">
                {chapters[activeLesson.ci].programmingCodes?.map((code, idx) => {
                  const codeId = `chapter-${activeLesson.ci}-${idx}`;
                  const isCopied = copiedCodeId === codeId;
                  return (
                    <div key={idx} className={`rounded-xl border p-4 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-base font-bold ${textPrimary}`}>{code.fileName || `Code ${idx + 1}`}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                            {code.language}
                          </span>
                          <button
                            onClick={() => copyCode(code.code, codeId)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                            title={isCopied ? 'Copied!' : 'Copy code'}
                          >
                            {isCopied ? <FiCheckCircle size={16} className="text-emerald-500" /> : <FiCopy size={16} />}
                          </button>
                        </div>
                      </div>
                      <pre className={`text-sm p-3 rounded-lg overflow-x-auto ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        <code>{code.code}</code>
                      </pre>
                      {code.explanation && (
                        <div
                          className={`text-sm mt-3 leading-relaxed rich-body ${textSecondary}`}
                          dangerouslySetInnerHTML={{ __html: code.explanation }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assets */}
          {activeIndex >= 0 && activeLesson && chapters[activeLesson.ci]?.assets && chapters[activeLesson.ci].assets.length > 0 && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiDownload size={22} /> Course Assets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {chapters[activeLesson.ci].assets?.map((asset, idx) => (
                  <a
                    key={idx}
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                  >
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      <FiFileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-base font-semibold truncate ${textPrimary}`}>{asset.name}</p>
                      <p className={`text-sm ${textSecondary}`}>Click to download</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {activeIndex >= 0 && activeLesson && chapters[activeLesson.ci]?.quizzes && chapters[activeLesson.ci].quizzes.length > 0 && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiFileText size={22} /> Chapter Quizzes
              </h2>
              <div className="space-y-6">
                {chapters[activeLesson.ci].quizzes?.map((quiz, quizIdx) => (
                  <div key={quizIdx} className={`rounded-xl border p-5 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>{quiz.title || `Quiz ${quizIdx + 1}`}</h3>
                    <div className="space-y-4">
                      {quiz.questions.map((question, qi) => {
                        const key = `${String(quizIdx)}-${qi}`;
                        const showResult = showQuizResults[String(quizIdx)];
                        
                        return (
                          <div key={qi}>
                            <p className={`text-base font-medium mb-3 ${textPrimary}`}>{question.question}</p>
                            <div className="space-y-2">
                              {question.options.map((option, oi) => {
                                const isSelected = quizAnswers[key] === option.option;
                                const isCorrectOption = option.isCorrect;
                                
                                let optionClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
                                if (showResult) {
                                  if (isCorrectOption) {
                                    optionClass = isDark ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-200';
                                  } else if (isSelected && !isCorrectOption) {
                                    optionClass = isDark ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200';
                                  }
                                } else if (isSelected) {
                                  optionClass = isDark ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200';
                                }
                                
                                return (
                                  <button
                                    key={oi}
                                    onClick={() => !showResult && handleQuizAnswer(String(quizIdx), qi, option.option)}
                                    disabled={showResult}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${optionClass} ${showResult ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        showResult && isCorrectOption ? 'border-emerald-500 bg-emerald-500' :
                                        showResult && isSelected && !isCorrectOption ? 'border-red-500 bg-red-500' :
                                        isSelected ? 'border-blue-500 bg-blue-500' :
                                        isDark ? 'border-slate-600' : 'border-slate-300'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                      </div>
                                      <span className={`text-base ${textPrimary}`}>{option.option}</span>
                                      {showResult && isCorrectOption && (
                                        <span className={`text-sm font-bold ml-auto ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!showQuizResults[String(quizIdx)] && (
                      <button
                        onClick={() => submitQuiz(String(quizIdx), quiz)}
                        className={`mt-4 px-4 py-2 rounded-lg text-base font-bold transition-colors ${
                          isDark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Submit Quiz
                      </button>
                    )}
                    {showQuizResults[String(quizIdx)] && (
                      <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <p className={`text-base font-bold ${textPrimary}`}>
                          Quiz Completed! Your score: {quizScores[String(quizIdx)] !== undefined ? quizScores[String(quizIdx)] : 0}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy course support - show course-level programming codes, assets, and quizzes */}
          {activeIndex === -1 && course?.programmingCodes && course.programmingCodes.length > 0 && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiCode size={22} /> Course Programming Codes
              </h2>
              <div className="space-y-4">
                {course.programmingCodes.map((code, idx) => {
                  const codeId = `course-${idx}`;
                  const isCopied = copiedCodeId === codeId;
                  return (
                    <div key={idx} className={`rounded-xl border p-4 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-base font-bold ${textPrimary}`}>{code.fileName || `Code ${idx + 1}`}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                            {code.language}
                          </span>
                          <button
                            onClick={() => copyCode(code.code, codeId)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                            title={isCopied ? 'Copied!' : 'Copy code'}
                          >
                            {isCopied ? <FiCheckCircle size={16} className="text-emerald-500" /> : <FiCopy size={16} />}
                          </button>
                        </div>
                      </div>
                      <pre className={`text-sm p-3 rounded-lg overflow-x-auto ${isDark ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                        <code>{code.code}</code>
                      </pre>
                      {code.explanation && (
                        <div
                          className={`text-sm mt-3 leading-relaxed rich-body ${textSecondary}`}
                          dangerouslySetInnerHTML={{ __html: code.explanation }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeIndex === -1 && course?.assets && course.assets.length > 0 && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiDownload size={22} /> Course Assets
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.assets.map((asset, idx) => (
                  <a
                    key={idx}
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isDark ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                  >
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                      <FiFileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-base font-semibold truncate ${textPrimary}`}>{asset.name}</p>
                      <p className={`text-sm ${textSecondary}`}>Click to download</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {activeIndex === -1 && course?.quizzes && course.quizzes.length > 0 && (
            <div className={`rounded-2xl border shadow-sm p-6 md:p-8 ${cardStyle}`}>
              <h2 className={`text-xl font-black mb-4 flex items-center gap-2 ${textPrimary}`}>
                <FiFileText size={22} /> Course Quizzes
              </h2>
              <div className="space-y-6">
                {course.quizzes.map((quiz, quizIdx) => (
                  <div key={quizIdx} className={`rounded-xl border p-5 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${textPrimary}`}>{quiz.title || `Quiz ${quizIdx + 1}`}</h3>
                    <div className="space-y-4">
                      {quiz.questions.map((question, qi) => {
                        const key = `course-${quizIdx}-${qi}`;
                        const showResult = showQuizResults[`course-${quizIdx}`];
                        
                        return (
                          <div key={qi}>
                            <p className={`text-base font-medium mb-3 ${textPrimary}`}>{question.question}</p>
                            <div className="space-y-2">
                              {question.options.map((option, oi) => {
                                const isSelected = quizAnswers[key] === option.option;
                                const isCorrectOption = option.isCorrect;
                                
                                let optionClass = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
                                if (showResult) {
                                  if (isCorrectOption) {
                                    optionClass = isDark ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-emerald-50 border-emerald-200';
                                  } else if (isSelected && !isCorrectOption) {
                                    optionClass = isDark ? 'bg-red-500/20 border-red-500/50' : 'bg-red-50 border-red-200';
                                  }
                                } else if (isSelected) {
                                  optionClass = isDark ? 'bg-blue-500/20 border-blue-500/50' : 'bg-blue-50 border-blue-200';
                                }
                                
                                return (
                                  <button
                                    key={oi}
                                    onClick={() => !showResult && handleQuizAnswer(`course-${quizIdx}` as string, qi, option.option)}
                                    disabled={showResult}
                                    className={`w-full text-left p-3 rounded-lg border transition-colors ${optionClass} ${showResult ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                        showResult && isCorrectOption ? 'border-emerald-500 bg-emerald-500' :
                                        showResult && isSelected && !isCorrectOption ? 'border-red-500 bg-red-500' :
                                        isSelected ? 'border-blue-500 bg-blue-500' :
                                        isDark ? 'border-slate-600' : 'border-slate-300'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                      </div>
                                      <span className={`text-base ${textPrimary}`}>{option.option}</span>
                                      {showResult && isCorrectOption && (
                                        <span className={`text-sm font-bold ml-auto ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!showQuizResults[`course-${quizIdx}`] && (
                      <button
                        onClick={() => submitQuiz(`course-${quizIdx}` as string, quiz)}
                        className={`mt-4 px-4 py-2 rounded-lg text-base font-bold transition-colors ${
                          isDark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Submit Quiz
                      </button>
                    )}
                    {showQuizResults[`course-${quizIdx}`] && (
                      <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <p className={`text-base font-bold ${textPrimary}`}>
                          Quiz Completed! Your score: {quizScores[`course-${quizIdx}`] !== undefined ? quizScores[`course-${quizIdx}`] : 0}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promo banner card */}
          <div className={`relative overflow-hidden rounded-2xl ${isDark ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900' : 'bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900'} text-white p-6 md:p-8 shadow-lg`}>
            <div className="absolute -right-6 -top-6 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-wrap items-center gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200 mb-2">The Full Course</p>
                <h2 className="text-xl md:text-2xl font-black leading-snug">
                  {course.courseName}
                </h2>
                <p className="text-sm font-semibold text-white/80 mt-1">
                  {course.duration} hours · {lessons.length} lessons · {chapters.length} chapters · Certificate of completion
                </p>
                {course.courseRequirements && course.courseRequirements.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {course.courseRequirements.slice(0, 3).map((req, idx) => (
                      <span key={idx} className="text-xs font-medium px-2 py-1 rounded bg-white/10">
                        {req}
                      </span>
                    ))}
                    {course.courseRequirements.length > 3 && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-white/10">
                        +{course.courseRequirements.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15">
                  <span className="text-2xl font-black">{percentComplete}%</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70">Complete</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15">
                  <FiZap size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70">{instructorName}</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-white/10 border border-white/15">
                  <span className="flex items-center gap-1 text-2xl font-black"><FiStar size={16} /> {lessons.length - completed.size}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/70">Remaining</span>
                </div>
              </div>
            </div>
          </div>

          {/* Prev / Next footer */}
          {lessons.length > 0 && (
            <div className={`flex items-center justify-between gap-3 border-t pt-5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={goPrev}
                disabled={activeIndex === 0}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-bold transition-colors cursor-pointer disabled:opacity-40 ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <FiChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={goNext}
                disabled={activeIndex >= lessons.length - 1}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-bold transition-colors cursor-pointer disabled:opacity-40 ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Next <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Rate Course Modal */}
      {course && (
        <RateCourseModal
          isOpen={showRateModal}
          onClose={() => setShowRateModal(false)}
          courseName={course.courseName}
          courseId={courseId || ''}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
