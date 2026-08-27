'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/store/theme.store';
import { useAuthStore } from '@/store/auth.store';
import { mentorService, Mentor } from '@/services/mentor.service';
import {
  BiCodeAlt as CodeIcon,
  BiGroup as Users,
  BiDollar as DollarSignIcon,
} from 'react-icons/bi';
import Navbar from '../../components/Navbar';

export default function MentorsPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await mentorService.getMentors();
        if (res.status === 'success') {
          setMentors(res.mentors ?? []);
        } else {
          setError('Could not load mentors. Please try again.');
        }
      } catch {
        setError('Could not load mentors. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, []);

  // Requesting a mentor requires authentication — guests go through get-started
  const handleRequestMentor = (mentorId: string) => {
    if (!isAuthenticated) {
      router.push(`/get-started?redirect=${encodeURIComponent('/mentors')}`);
      return;
    }
    router.push(`/mentor?mentor=${mentorId}`);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Navbar />

      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 pt-28">
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Available Mentors
          </h1>
          <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
            Choose an expert mentor and request a personalized mentorship
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" aria-busy="true" aria-label="Loading mentors">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-3xl p-6 border shadow-sm flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
              >
                {/* Header: Avatar + Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-16 h-16 rounded-full shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className={`h-4 w-3/4 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <div className={`h-3 w-1/2 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2.5 mb-5">
                  {[85, 60, 45].map((w) => (
                    <div key={w} className="flex items-center gap-3">
                      <div className={`w-[18px] h-[18px] rounded shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      <div
                        className={`h-3 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="space-y-2 mb-6">
                  {[100, 92, 65].map((w) => (
                    <div
                      key={w}
                      className={`h-3 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>

                {/* Action */}
                <div className={`mt-auto h-[52px] w-full rounded-2xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && mentors.length === 0 && (
          <div className={`max-w-md mx-auto rounded-2xl p-10 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
            <p className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No mentors available yet</p>
            <p className={isDark ? 'text-slate-400' : 'text-gray-500'}>
              Check back soon — our instructors are activating their mentorship accounts.
            </p>
          </div>
        )}

        {!loading && mentors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <div
                key={mentor._id}
                className={`rounded-3xl p-6 border shadow-sm hover:shadow-xl transition-shadow flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}
              >
                {/* Header: Avatar + Name */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative w-16 h-16 shrink-0">
                    {mentor.profilePicture ? (
                      <Image
                        width={64}
                        height={64}
                        alt={mentor.name}
                        src={mentor.profilePicture}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-50 shadow-sm"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#0F1C2E] font-bold text-lg">
                        {mentor.name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-lg font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {mentor.name}
                    </h3>
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                      {mentor.specialization}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2.5 mb-5">
                  <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    <CodeIcon size={18} className="text-blue-500 shrink-0" />
                    <span className="text-sm font-medium truncate">{mentor.specialization}</span>
                  </div>
                  <div className={`flex items-center gap-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    <Users size={18} className="text-blue-500 shrink-0" />
                    <span className="text-sm font-medium">1-on-1 & Group sessions</span>
                  </div>
                  <div className={`flex items-center gap-3 font-bold ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    <DollarSignIcon size={18} className="text-blue-500 shrink-0" />
                    <span className="text-sm">₦{mentor.mentorshipPrice ?? 0}/session</span>
                  </div>
                </div>

                {/* Bio */}
                <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {mentor.mentorshipBio || mentor.bio || `${mentor.name} is ready to guide you through your learning journey.`}
                </p>

                {/* Action */}
                <button
                  onClick={() => handleRequestMentor(mentor._id)}
                  className="mt-auto w-full bg-[#1d61ff] hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-lg cursor-pointer"
                >
                  Request This Mentor
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
