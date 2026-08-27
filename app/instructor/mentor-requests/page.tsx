"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FiLoader,
  FiCheck,
  FiX,
  FiUser,
  FiAlertCircle,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import InstructorSidebar from "@/app/components/InstructorSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { mentorService, InstructorMentorRequest } from "@/services/mentor.service";

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const formatTime = (time24: string): string => {
  const [h, m] = time24.split(':').map(Number);
  if (Number.isNaN(h)) return time24;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m ?? 0).padStart(2, '0')} ${period}`;
};

export default function InstructorMentorRequestsPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState<InstructorMentorRequest[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);
  const [acceptTarget, setAcceptTarget] = useState<InstructorMentorRequest | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ availableTime: "", programDuration: "" });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const { logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const useStructuredTime =
    acceptTarget?.availability === 'Weekdays' ||
    acceptTarget?.availability === 'Weekends' ||
    acceptTarget?.availability === 'Evenings';

  const structuredPreview = (() => {
    if (!useStructuredTime || !acceptTarget) return '';
    const dayPart = selectedDays.length > 0 ? selectedDays.join(', ') : '';
    const timePart = startTime && endTime ? `${formatTime(startTime)} to ${formatTime(endTime)}` : startTime ? formatTime(startTime) : '';
    return [dayPart, timePart].filter(Boolean).join(' — ');
  })();

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const loadRequests = async () => {
    try {
      const res = await mentorService.getMentorRequests();
      if (res.status === 'success') {
        setRequests(res.requests ?? []);
      } else {
        setError('Could not load mentorship requests');
      }
    } catch {
      setError('Could not load mentorship requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(loadRequests, 0);
    return () => clearTimeout(t);
  }, []);

  const openAcceptModal = (request: InstructorMentorRequest) => {
    setAcceptTarget(request);
    setScheduleForm({ availableTime: "", programDuration: "" });
    setScheduleError("");
    setError('');
    setSuccess('');

    if (request.availability === 'Weekends') {
      setSelectedDays(['Sat', 'Sun']);
    } else if (request.availability === 'Weekdays') {
      setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    } else {
      setSelectedDays([]);
    }
    setStartTime('');
    setEndTime('');
  };

  const confirmAccept = async () => {
    if (!acceptTarget) return;

    let finalAvailableTime = '';
    if (useStructuredTime) {
      const dayPart = selectedDays.length > 0 ? selectedDays.join(', ') : '';
      const timePart = startTime && endTime
        ? `${formatTime(startTime)} to ${formatTime(endTime)}`
        : startTime ? formatTime(startTime) : '';
      finalAvailableTime = [dayPart, timePart].filter(Boolean).join(' — ');
    } else {
      finalAvailableTime = scheduleForm.availableTime.trim();
    }

    if (!finalAvailableTime) {
      setScheduleError("Set the available time for this student");
      return;
    }
    if (!scheduleForm.programDuration.trim()) {
      setScheduleError("Enter the duration of the mentoring program");
      return;
    }

    setActionId(acceptTarget._id);
    setScheduleError("");
    try {
      const res = await mentorService.acceptMentorRequest(acceptTarget._id, {
        availableTime: finalAvailableTime,
        programDuration: scheduleForm.programDuration.trim(),
      });
      if (res.status === 'success') {
        // Keep the card visible in accepted state
        setRequests((prev) => prev.map((r) =>
          r._id === acceptTarget._id
            ? { ...r, status: 'accepted' as const, availableTime: finalAvailableTime, programDuration: scheduleForm.programDuration.trim() }
            : r
        ));
        setSuccess(res.message || 'Mentorship request accepted. The student has been notified.');
        setAcceptTarget(null);
      } else {
        setScheduleError(res.message || 'Failed to accept request');
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setScheduleError(message || 'Failed to accept request');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionId(requestId);
    setError('');
    setSuccess('');
    try {
      const res = await mentorService.rejectMentorRequest(requestId);
      if (res.status === 'success') {
        setSuccess(res.message || 'Mentorship request declined. The student has been notified.');
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      } else {
        setError(res.message || 'Failed to decline request');
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Failed to decline request');
    } finally {
      setActionId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');

  const inputBorder = isDark ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' : 'bg-white border-slate-200 text-[#111827] focus:border-blue-500';
  const inputBase = `w-full px-4 py-3 rounded-xl border ${inputBorder} focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60`;

  return (
    <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
      <InstructorSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/instructor/mentor-requests"
        onLogout={async () => {
          await logout();
          window.location.href = '/get-started';
        }}
      />

      <main className={`grow p-5 lg:p-10 overflow-y-auto w-full ${isDark ? 'text-white' : 'text-[#111827]'}`}>
        <header className="mb-10">
          <h2 className="text-xl lg:text-2xl font-medium">Mentorship Requests</h2>
          <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
            Students who want you as their mentor
          </p>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiX className="text-red-600" size={20} />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiCheck className="text-green-600" size={20} />
            <p className="text-green-600 font-medium">{success}</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading requests">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`rounded-3xl p-6 border shadow-sm flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-full shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className={`h-4 w-28 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <div className={`h-3 w-36 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  </div>
                </div>
                <div className={`rounded-2xl p-4 mb-5 space-y-2.5 ${isDark ? 'bg-slate-700/60' : 'bg-slate-50'}`}>
                  {[70, 55, 40, 60].map((w) => (
                    <div key={w} className="flex items-center gap-3">
                      <div className={`h-3 w-16 rounded ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`} />
                      <div className={`h-3 rounded animate-pulse ${isDark ? 'bg-slate-600' : 'bg-gray-200'}`} style={{ width: `${w}%` }} />
                    </div>
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <div className={`h-12 rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  <div className={`h-12 rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Pending Requests ─────────────────────────────────────── */}
        {!loading && pendingRequests.length > 0 && (
          <>
            <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Pending</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              {pendingRequests.map((req) => (
                <div key={req._id} className={`rounded-3xl p-6 border shadow-sm flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  {/* Student header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-14 h-14 shrink-0">
                      {req.studentId?.profilePicture ? (
                        <Image width={56} height={56} alt={req.studentId.name} src={req.studentId.profilePicture} className="w-14 h-14 rounded-full object-cover border-2 border-blue-50" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-[#0F1C2E] font-bold">
                          {(req.studentId?.name ?? 'S').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{req.studentId?.name}</h3>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{req.studentId?.email}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className={`rounded-2xl p-4 mb-5 space-y-1.5 text-sm ${isDark ? 'bg-slate-700/60' : 'bg-slate-50'}`}>
                    <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-semibold">Category:</span> {req.skillCategory}</p>
                    <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-semibold">Goal:</span> {req.learningGoal}</p>
                    <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-semibold">Level:</span> {req.skillLevel}</p>
                    <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-semibold">Type:</span> {req.mentorshipType}</p>
                    {req.budgetRange && <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-semibold">Budget:</span> {req.budgetRange}</p>}
                    {req.availability && <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-semibold">Availability:</span> {req.availability}</p>}
                    {req.additionalNotes && <p className={`pt-1 italic ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>&ldquo;{req.additionalNotes}&rdquo;</p>}
                  </div>

                  {/* Actions — only for pending */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button onClick={() => handleReject(req._id)} disabled={actionId === req._id}
                      className="border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 py-3 rounded-xl font-bold transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                      {actionId === req._id ? <FiLoader className="animate-spin" size={18} /> : <FiX size={18} />} Decline
                    </button>
                    <button onClick={() => openAcceptModal(req)} disabled={actionId === req._id}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                      {actionId === req._id ? <FiLoader className="animate-spin" size={18} /> : <FiCheck size={18} />} Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Accepted ─────────────────────────────────────────────── */}
        {!loading && acceptedRequests.length > 0 && (
          <>
            <h3 className={`text-base font-bold mb-4 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>Accepted</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
              {acceptedRequests.map((req) => (
                <div key={req._id} className={`rounded-3xl p-6 border shadow-sm flex flex-col ${isDark ? 'bg-slate-800 border-emerald-700/60' : 'bg-white border-emerald-200'}`}>
                  {/* Student header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-14 h-14 shrink-0">
                      {req.studentId?.profilePicture ? (
                        <Image width={56} height={56} alt={req.studentId.name} src={req.studentId.profilePicture} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-200" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                          {(req.studentId?.name ?? 'S').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{req.studentId?.name}</h3>
                      <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{req.studentId?.email}</p>
                    </div>
                  </div>

                  {/* Schedule info */}
                  <div className={`rounded-2xl p-4 space-y-2 text-sm ${isDark ? 'bg-emerald-900/30 border border-emerald-800/50' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <p className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <FiCheck size={14} /> Mentorship Accepted
                    </p>
                    {req.availableTime && (
                      <p className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
                        <span className="font-semibold">Schedule:</span> {req.availableTime}
                      </p>
                    )}
                    {req.programDuration && (
                      <p className={isDark ? 'text-emerald-300' : 'text-emerald-700'}>
                        <span className="font-semibold">Duration:</span> {req.programDuration}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Empty state ──────────────────────────────────────────── */}
        {!loading && requests.length === 0 && (
          <div className={`rounded-2xl p-10 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
            <FiUser size={32} className="mx-auto mb-3 text-blue-500" />
            <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No pending requests</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              When students request you as their mentor, they will appear here.
            </p>
          </div>
        )}
      </main>

      {/* ── Accept Modal ──────────────────────────────────────────── */}
      {acceptTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => { if (actionId !== acceptTarget._id) setAcceptTarget(null); }}>
          <div onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-[#111827]'}`}>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold">Set Program Schedule</h3>
              <button onClick={() => setAcceptTarget(null)} disabled={actionId === acceptTarget._id}
                className={`p-1 rounded-full transition-colors cursor-pointer disabled:opacity-50 ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}>
                <FiX size={20} />
              </button>
            </div>
            <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Accepting <span className="font-semibold">{acceptTarget.studentId?.name}</span>&apos;s request
              {acceptTarget.availability && <> — they are available on <span className="font-semibold">{acceptTarget.availability}</span></>}.
            </p>

            {scheduleError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <FiAlertCircle className="text-red-600 shrink-0" size={18} />
                <p className="text-red-600 text-sm font-medium">{scheduleError}</p>
              </div>
            )}

            <div className="space-y-5">
              {/* ── Available Time ── */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <FiClock size={15} /> Available Time
                </label>

                {useStructuredTime ? (
                  <div className="space-y-3">
                    {/* Day chips — hidden when Evenings (days not implied) */}
                    {acceptTarget.availability !== 'Evenings' && (
                      <div className="flex flex-wrap gap-2">
                        {ALL_DAYS.map((day) => {
                          const selected = selectedDays.includes(day);
                          return (
                            <button key={day} type="button" onClick={() => toggleDay(day)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                selected
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                  : isDark
                                    ? 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:border-gray-300'
                              }`}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Time range inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Start Time</label>
                        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                          disabled={actionId === acceptTarget._id}
                          className={`${inputBase} cursor-pointer`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>End Time</label>
                        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                          disabled={actionId === acceptTarget._id}
                          className={`${inputBase} cursor-pointer`} />
                      </div>
                    </div>

                    {structuredPreview && (
                      <p className={`text-xs px-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                        Preview: <span className="font-semibold">{structuredPreview}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <input type="text" value={scheduleForm.availableTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, availableTime: e.target.value })}
                    disabled={actionId === acceptTarget._id}
                    className={inputBase}
                    placeholder="e.g. Mon, Wed & Fri — 4:00 PM to 6:00 PM (WAT)" />
                )}
              </div>

              {/* ── Program Duration ── */}
              <div>
                <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <FiCheck size={15} /> Program Duration
                </label>
                <input type="text" value={scheduleForm.programDuration}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, programDuration: e.target.value })}
                  disabled={actionId === acceptTarget._id}
                  className={inputBase}
                  placeholder="e.g. 8 weeks (24 sessions total)" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button onClick={() => setAcceptTarget(null)} disabled={actionId === acceptTarget._id}
                className={`py-3 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-60 border-2 ${
                  isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-100'
                }`}>
                Cancel
              </button>
              <button onClick={confirmAccept} disabled={actionId === acceptTarget._id}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2">
                {actionId === acceptTarget._id ? <FiLoader className="animate-spin" size={18} /> : <FiCheck size={18} />}
                Accept &amp; Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
