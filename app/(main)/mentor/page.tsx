'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { mentorService, Mentor } from '@/services/mentor.service';
import {
  BiChevronDown as ChevronDown,
  BiCode as Code,
  BiGroup as Users,
  BiDollarCircle as DollarSign,
  BiStar as Star,
  BiUser as User,
  BiGroup as GroupIcon,
  BiRightArrowAlt as ArrowRight,
  BiSolidMagicWand as Sparkles,
  BiTargetLock as Target,              // Icon for step 1
  BiGitMerge as Merge,                 // Icon for step 2
  BiCheckCircle as CheckCircle,        // Icon for step 3
  BiBookOpen as Graduation,            // Icon for step 4
  BiLoaderAlt as Loader
} from 'react-icons/bi';
import Navbar from '../../components/Navbar';

const categories = [
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Mobile Development',
  'Other',
];

export default function RequestMentorPage() {
  return (
    <Suspense fallback={null}>
      <RequestMentorContent />
    </Suspense>
  );
}

function RequestMentorContent() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const steps = [
    {
      number: 1,
      title: "Tell Us Your Goal",
      description: "Fill a simple form about what you want to learn",
      icon: <Target size={40} className="text-blue-500" />
    },
    {
      number: 2,
      title: "We Match You",
      description: "We connect you with the right mentor",
      icon: <Merge size={40} className="text-blue-500" />
    },
    {
      number: 3,
      title: "Get Approved",
      description: "Receive mentor details and session plan",
      icon: <CheckCircle size={40} className="text-blue-500" />
    },
    {
      number: 4,
      title: "Start Learning",
      description: "Begin your mentorship journey",
      icon: <Graduation size={40} className="text-blue-500" />
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Navbar />

      {/* SECTION 1: How It Works - Steps */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="text-center mb-20">
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Request a Mentor
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Get personalized guidance to grow faster</p>
        </div>

        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>How It Works</h2>
          <p className={`mb-12 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Simple steps to connect with your perfect mentor</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className={`p-8 rounded-2xl border text-center hover:shadow-lg transition-shadow ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
                {/* Icon from react-icons */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.number}
                </div>

                <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* SECTION 2: Request Details Form with AI Recommendation */}
      <RequestDetailsPage />
    </div>
  );
}

const RequestDetailsPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const [learningGoal, setLearningGoal] = useState('Career Change');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [type, setType] = useState<'Private' | 'Group'>('Private');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [availability, setAvailability] = useState('');
  const [notes, setNotes] = useState('');

  // Mentors fetched from the backend for the select input
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Scroll straight to the request form when arriving via ?mentor=<id>
  const formRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await mentorService.getMentors();
        if (!cancelled && res.status === 'success') {
          setMentors(res.mentors ?? []);
          // Support ?mentor=<id> deep link from the mentors listing page
          const preselect = searchParams.get('mentor');
          if (preselect && res.mentors?.some((m) => m._id === preselect)) {
            setSelectedMentorId(preselect);
          }
        }
      } catch {
        // Dropdown simply stays empty when the API fails
      } finally {
        if (!cancelled) setLoadingMentors(false);
      }
    };
    const t = setTimeout(load, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [searchParams]);

  useEffect(() => {
    if (hasScrolledRef.current || loadingMentors) return;
    if (!searchParams.get('mentor')) return;
    hasScrolledRef.current = true;
    // Small delay lets the preselect render before scrolling into view
    const t = setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    return () => clearTimeout(t);
  }, [searchParams, loadingMentors]);

  const learningGoals = [
    'Career Change',
    'Skill Enhancement',
    'Project Guidance',
    'Interview Preparation',
  ];

  const selectedMentor = mentors.find((m) => m._id === selectedMentorId);

  const handleSelectMentorChange = (value: string) => {
    setSelectedMentorId(value);
    setFormError('');
  };

  const handleSubmitRequest = async () => {
    setFormError('');
    setFormSuccess('');

    // Requesting a mentor requires an authenticated account
    if (!isAuthenticated) {
      router.push(`/get-started?redirect=${encodeURIComponent('/mentor')}`);
      return;
    }

    if (!selectedMentorId) {
      setFormError('Please choose a mentor from the list');
      return;
    }
    if (!category) {
      setFormError('Please select a skill / category');
      return;
    }
    if (category === 'Other' && !customCategory.trim()) {
      setFormError('Please enter your skill or category');
      return;
    }

    setSubmitting(true);
    try {
      const res = await mentorService.requestMentorship({
        instructorId: selectedMentorId,
        skillCategory: category === 'Other' ? customCategory.trim() : category,
        learningGoal,
        skillLevel: level,
        mentorshipType: type,
        budgetRange: budgetRange || undefined,
        availability: availability || undefined,
        additionalNotes: notes.trim() || undefined,
      });
      if (res.status === 'success') {
        setFormSuccess(res.message || 'Your mentorship request has been sent!');
        setTimeout(() => router.push('/student/mentorship'), 1800);
      } else {
        setFormError(res.message || 'Failed to send your request');
      }
    } catch (err) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr?.response?.status === 401) {
        router.push(`/get-started?redirect=${encodeURIComponent('/mentor')}`);
        return;
      }
      setFormError(axiosErr?.response?.data?.message || 'Failed to send your request');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles = `
    w-full p-4 border-none rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}
  `;

  return (
    <div className={`${isDark ? 'bg-slate-900' : 'bg-gray-50'} py-16 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN: FORM DETAILS */}
          <div ref={formRef} id="request-details" className={`flex-1 rounded-3xl p-8 md:p-12 shadow-sm border scroll-mt-28 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <h1 className={`text-3xl font-bold mb-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>Request Details</h1>

            <div className="space-y-8">
              {/* Mentor Selection — pick the exact mentor you want */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Choose Your Mentor</label>
                <div className="relative">
                  <select
                    value={selectedMentorId}
                    onChange={(e) => handleSelectMentorChange(e.target.value)}
                    disabled={loadingMentors}
                    className={`w-full border-none rounded-xl py-4 px-5 appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:cursor-wait ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <option value="">
                      {loadingMentors ? 'Loading mentors…' : mentors.length === 0 ? 'No mentors available yet' : 'Select a mentor'}
                    </option>
                    {mentors.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name} — {m.specialization}{m.mentorshipPrice ? ` (₦${m.mentorshipPrice}/session)` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Skill Category */}
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Skill / Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setCustomCategory(''); }}
                    className={`w-full border-none rounded-xl py-4 px-5 appearance-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer ${isDark ? 'bg-slate-700 text-slate-200' : 'bg-gray-100 text-gray-700'}`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
                {category === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type your skill or category"
                    className={`mt-3 w-full p-4 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none ${isDark ? 'bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400' : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'}`}
                  />
                )}
              </div>

              {/* Learning Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Learning Goal</label>
                <div className="space-y-3">
                  {learningGoals.map((goal) => (
                    <label key={goal} className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${learningGoal === goal ? 'border-blue-500 bg-blue-50' : `border-gray-100 hover:border-gray-200 ${isDark ? 'border-slate-700 hover:border-slate-600' : ''}`}`}>
                      <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${learningGoal === goal ? 'border-blue-500' : `border-gray-300 ${isDark ? 'border-slate-600' : ''}`}`}>
                        {learningGoal === goal && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
                      </div>
                      <input type="radio" className="hidden" name="goal" checked={learningGoal === goal} onChange={() => setLearningGoal(goal)} />
                      <span className={`font-medium ${learningGoal === goal ? 'text-blue-900' : isDark ? 'text-slate-400' : 'text-gray-600'}`}>{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Skill Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-3 rounded-xl font-semibold border-2 transition-all cursor-pointer ${level === l ? 'bg-blue-600 border-blue-600 text-white' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-pointer' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 cursor-pointer'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mentorship Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Mentorship Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setType('Private')}
                    className={`flex items-center justify-center py-4 rounded-xl font-semibold border-2 transition-all cursor-pointer ${type === 'Private' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-pointer' : 'bg-white border-gray-100 text-gray-500 cursor-pointer'}`}
                  >
                    <User className="w-5 h-5 mr-2" /> Private (1-on-1)
                  </button>
                  <button
                    onClick={() => setType('Group')}
                    className={`flex items-center justify-center py-4 rounded-xl font-semibold border-2 transition-all cursor-pointer ${type === 'Group' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : isDark ? 'bg-slate-800 border-slate-700 text-slate-400 cursor-pointer' : 'bg-white border-gray-100 text-gray-500 cursor-pointer'}`}
                  >
                    <GroupIcon className="w-5 h-5 mr-2" /> Group
                  </button>
                </div>
              </div>

              {/* Budget Range Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Budget Range (Full session)</label>
                <div className="relative">
                  <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={inputStyles + " cursor-pointer appearance-none"}>
                    <option value="">Select budget range</option>
                    <option value="₦20,000 - ₦50,000">₦20,000 - ₦50,000</option>
                    <option value="₦50,000 - ₦100,000">₦50,000 - ₦100,000</option>
                    <option value="₦100,000+">₦100,000+</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Availability Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Availability</label>
                <div className="relative">
                  <select value={availability} onChange={(e) => setAvailability(e.target.value)} className={inputStyles + " cursor-pointer appearance-none"}>
                    <option value="">Select your availability</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="Evenings">Evenings</option>
                  </select>
                  <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-slate-400' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-3">Additional Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us more about your learning goals, expectations, or any specific requirements..."
                  className={`w-full p-4 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-gray-200 text-gray-600'}`}
                />
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">{formError}</div>
              )}
              {formSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-600 text-sm font-medium">{formSuccess}</div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitRequest}
                disabled={submitting}
                className={isDark ? "w-full bg-transparent hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-slate-600" : "w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center transition-all shadow-xl shadow-blue-100 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"}
              >
                {submitting ? (
                  <>
                    <Loader className="animate-spin mr-2 w-5 h-5" /> Sending Request…
                  </>
                ) : (
                  <>
                    Request Mentor <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: SELECTED MENTOR PREVIEW */}
          <div className="w-full lg:w-105 shrink-0">
            <div className={`max-w-95 rounded-4xl p-6 shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>

              {/* Recommended Badge */}
              <div className={`flex items-center gap-2 mb-6 ${isDark ? 'text-slate-400' : ''}`}>
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  <Sparkles size={18} className="text-blue-600" />
                </div>
                <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {selectedMentor ? 'Your Selected Mentor' : 'AI Recommended'}
                </span>
              </div>
              <div className={`rounded-3xl p-5 border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-[#DBEAFE] border-blue-100/50'}`}>
                <div className="flex flex-col gap-5">
                  {/* Header: Avatar and Name */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                      {selectedMentor?.profilePicture ? (
                        <Image
                          width={80}
                          height={80}
                          alt={selectedMentor.name}
                          src={selectedMentor.profilePicture}
                          className="w-20 h-20 rounded-full object-cover border-2 border-blue-50 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-[#0F1C2E] font-bold text-xl">
                          {(selectedMentor?.name ?? 'MT').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedMentor?.name ?? 'Choose a mentor'}
                      </h3>
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                        {selectedMentor?.specialization ?? 'Pick one from the dropdown'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className={`text-xs font-semibold ml-1 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Expert</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <Code size={18} className="text-blue-500" />
                      <span className="text-[15px] font-medium truncate">{selectedMentor?.specialization ?? '—'}</span>
                    </div>
                    <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      <Users size={18} className="text-blue-500" />
                      <span className="text-[15px] font-medium">Available now</span>
                    </div>
                    <div className={`flex items-center gap-3 font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                      <DollarSign size={18} className="text-blue-500" />
                      <span className="text-[15px]">
                        {selectedMentor?.mentorshipPrice ? `₦${selectedMentor.mentorshipPrice}/session` : 'Price per session'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {selectedMentor?.mentorshipBio || selectedMentor?.bio || 'Select a mentor above to see their profile and request them directly.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
