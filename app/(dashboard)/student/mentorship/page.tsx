"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiLoader,
  FiMessageCircle,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCreditCard,
  FiAlertTriangle,
} from "react-icons/fi";
import { BiDollar as DollarSign } from "react-icons/bi";
import StudentSidebar from "@/app/components/StudentSidebar";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { mentorService, StudentMentorship, StudentPendingRequest } from "@/services/mentor.service";
import { RenewMentorshipModal } from "@/app/components/constants/Students/RenewMentorshipModal";
import { MentorshipMenu } from "@/app/components/constants/Students/MentorshipMenu";
import { ReportInstructorModal } from "@/app/components/constants/Students/ReportInstructorModal";
import { DeleteMentorshipModal } from "@/app/components/constants/Students/DeleteMentorshipModal";

export default function StudentMentorshipPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mentorships, setMentorships] = useState<StudentMentorship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<StudentPendingRequest[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payError, setPayError] = useState("");
  const { logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Modal states
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedMentorship, setSelectedMentorship] = useState<StudentMentorship | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await mentorService.getMyMentorships();
        if (!cancelled && res.status === 'success') {
          setMentorships(res.mentorships ?? []);
          setPendingRequests(res.pendingRequests ?? []);
        } else if (!cancelled) {
          setError(res.message || "Could not load your mentorships");
        }
      } catch {
        if (!cancelled) setError("Could not load your mentorships");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    const t = setTimeout(load, 0);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Handle payment success callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get('payment');
    const status = urlParams.get('status');
    const txRef = urlParams.get('tx_ref');
    const transactionId = urlParams.get('transaction_id');

    if (payment === 'success' && status === 'completed' && txRef?.includes('MENTOR-RENEW')) {
      // Verify the payment with backend before refreshing
      const verifyPayment = async () => {
        try {
          if (transactionId) {
            await mentorService.verifyPayment(txRef, transactionId);
          }
          // Refresh mentorships after successful renewal payment
          const res = await mentorService.getMyMentorships();
          if (res.status === 'success') {
            setMentorships(res.mentorships ?? []);
            setPendingRequests(res.pendingRequests ?? []);
          }
        } catch (err) {
          console.error('Failed to verify payment or refresh mentorships:', err);
        }
      };

      verifyPayment();

      // Clean up URL
      window.history.replaceState({}, '', '/student/mentorship');
    }
  }, []);

  // Payment for an accepted request — fetches a fresh Flutterwave link server-side
  const handlePayNow = async (req: StudentPendingRequest) => {
    setPayingId(req._id);
    setPayError("");
    try {
      const res = await mentorService.createMentorshipPayment(req._id);
      if (res.status === 'success' && res.paymentLink) {
        window.location.assign(res.paymentLink);
      } else {
        setPayError(res.message || "Could not start payment. Please try again.");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPayError(message || "Could not start payment. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  // Renew mentorship
  const handleRenewMentorship = async (duration: string) => {
    if (!selectedMentorship) return;

    try {
      const res = await mentorService.renewMentorship(selectedMentorship.requestId, duration);
      if (res.status === 'success' && res.paymentLink) {
        setRenewModalOpen(false);
        window.location.assign(res.paymentLink);
      } else {
        alert(res.message || "Could not initiate renewal. Please try again.");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(message || "Could not initiate renewal. Please try again.");
    }
  };

  // Open renew modal
  const openRenewModal = (mentorship: StudentMentorship) => {
    setSelectedMentorship(mentorship);
    setRenewModalOpen(true);
  };

  // Report instructor
  const handleReportInstructor = async (instructorId: string, reason: string, description: string) => {
    try {
      const res = await mentorService.reportInstructor({
        instructorId,
        reason,
        description,
        mentorshipId: selectedMentorship?.requestId
      });

      if (res.status === 'success') {
        setReportModalOpen(false);
        alert("Report submitted successfully. An admin will review it shortly.");
      } else {
        alert(res.message || "Could not submit report. Please try again.");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(message || "Could not submit report. Please try again.");
    }
  };

  // Open report modal
  const openReportModal = (instructorId: string, instructorName: string) => {
    setSelectedInstructor({ id: instructorId, name: instructorName });
    setReportModalOpen(true);
  };

  // Delete mentorship
  const handleDeleteMentorship = async () => {
    if (!selectedMentorship) return;

    setIsDeleting(true);
    try {
      const res = await mentorService.deleteMentorship(selectedMentorship.requestId);
      if (res.status === 'success') {
        setDeleteModalOpen(false);
        // Refresh mentorships
        const refreshed = await mentorService.getMyMentorships();
        if (refreshed.status === 'success') {
          setMentorships(refreshed.mentorships ?? []);
        }
      } else {
        alert(res.message || "Could not end mentorship. Please try again.");
      }
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(message || "Could not end mentorship. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Open delete modal
  const openDeleteModal = (mentorship: StudentMentorship) => {
    setSelectedMentorship(mentorship);
    setDeleteModalOpen(true);
  };

  // Opens (or lazily creates) the in-app conversation with the mentor — chat
  // now lives on its own page, not a modal.
  const chatHref = (m: StudentMentorship) => `/student/mentorship/chat?mentorship=${m.requestId}`;

  return (
    <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
      <StudentSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/student/mentorship"
        onLogout={async () => {
          await logout();
          window.location.href = '/get-started';
        }}
      />

      <main className={`grow p-5 lg:p-10 overflow-y-auto w-full lg:ml-72 min-w-0 z-10 relative ${isDark ? 'text-white' : 'text-[#111827]'}`}>
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-medium">My Mentorship</h2>
            <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
              Your mentors and pending requests
            </p>
          </div>
          <Link
            href="/mentors"
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Browse Mentors
          </Link>
        </header>

        {loading && (
          <div aria-busy="true" aria-label="Loading mentorships">
            {/* Active Mentorships skeleton */}
            <section className="mb-12">
              <div className={`h-6 w-48 rounded mb-6 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-3xl p-6 border shadow-sm flex flex-col ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                  >
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-full shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className={`h-4 w-28 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                        <div className={`h-3 w-32 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className={`h-3 w-40 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      <div className={`h-3 w-56 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    </div>

                    {/* Price */}
                    <div className={`h-3 w-24 rounded mb-4 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                    {/* Button */}
                    <div className={`mt-auto h-14 w-full rounded-2xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  </div>
                ))}
              </div>
            </section>

            {/* Pending Requests skeleton */}
            <section>
              <div className={`h-6 w-48 rounded mb-6 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-3xl p-6 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                  >
                    {/* Status badge + clock */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-3 w-36 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      <div className={`w-4 h-4 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    </div>

                    {/* Mentor name */}
                    <div className={`h-5 w-32 rounded mb-2 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                    {/* Category + level */}
                    <div className={`h-3 w-44 rounded mb-1 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                    {/* Date */}
                    <div className={`h-3 w-28 rounded mb-5 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />

                    {/* Message / button block */}
                    <div className={`h-20 w-full rounded-xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiAlertCircle className="text-red-600" size={20} />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Active Mentorships — chat on WhatsApp */}
        {!loading && !error && (
          <>
            <section className="mb-12">
              <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Active Mentorships</h3>

              {mentorships.length === 0 ? (
                <div className={`rounded-2xl p-10 text-center border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <FiCheckCircle size={32} className="mx-auto mb-3 text-blue-500" />
                  <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No active mentorships yet</p>
                  <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Browse available mentors and request one to get started.
                  </p>
                  <Link
                    href="/mentors"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Browse Mentors
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mentorships.map((m) => {
                    const isEnded = m.status === 'ended';
                    return (
                    <div
                      key={m.requestId}
                      className={`rounded-3xl p-6 border shadow-sm flex flex-col ${isEnded ? (isDark ? 'bg-slate-800/60 border-slate-700/50 opacity-75' : 'bg-gray-50 border-gray-200 opacity-75') : isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-14 h-14 shrink-0">
                          {m.mentor.profilePicture ? (
                            <Image
                              width={56}
                              height={56}
                              alt={m.mentor.name}
                              src={m.mentor.profilePicture}
                              className={`w-14 h-14 rounded-full object-cover border-2 ${isEnded ? 'border-gray-300 grayscale' : 'border-blue-50'}`}
                            />
                          ) : (
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold ${isEnded ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-[#0F1C2E]'}`}>
                              {m.mentor.name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className={`font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.mentor.name}</h4>
                          <p className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{m.mentor.specialization}</p>
                        </div>
                        <MentorshipMenu
                          mentorshipId={m.requestId}
                          mentorId={m.mentor._id}
                          mentorName={m.mentor.name}
                          onDelete={() => openDeleteModal(m)}
                          onReport={(instructorId, instructorName) => openReportModal(instructorId, instructorName)}
                        />
                      </div>

                      {/* Ended badge */}
                      {isEnded && (
                        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-3 text-xs font-semibold ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                          <FiCheckCircle size={14} />
                          Program ended
                        </div>
                      )}

                      {/* Expiry warning — only for non-ended */}
                      {!isEnded && m.programEndDate && (() => {
                        const msLeft = new Date(m.programEndDate).getTime() - Date.now();
                        const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
                        if (daysLeft <= 0) return null;
                        if (daysLeft <= 7) {
                          return (
                            <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-3 text-xs font-semibold ${isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                              <FiAlertTriangle size={14} />
                              {daysLeft <= 1 ? 'Program expires today' : `Program expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
                            </div>
                          );
                        }
                        return (
                          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-3 text-xs ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                            <FiClock size={14} />
                            {daysLeft} day{daysLeft > 1 ? 's' : ''} remaining
                          </div>
                        );
                      })()}

                      {m.skillCategory && (
                        <p className={`text-sm mb-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                          Focus: <span className="font-semibold">{m.skillCategory}</span>
                          {m.mentorshipType ? ` • ${m.mentorshipType}` : ''}
                        </p>
                      )}
                      {m.mentor.mentorshipBio && (
                        <p className={`text-sm leading-relaxed mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {m.mentor.mentorshipBio}
                        </p>
                      )}

                      {m.amountPaid && (
                        <div className={`flex items-center gap-2 text-sm font-semibold mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          <DollarSign size={16} /> Paid ₦{m.amountPaid.toLocaleString()}
                        </div>
                      )}

                      {/* Ended → Renew button; Active → in-app Chat + WhatsApp */}
                      {isEnded ? (
                        <button
                          onClick={() => openRenewModal(m)}
                          className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer flex items-center justify-center gap-2"
                        >
                          Renew Mentorship
                        </button>
                      ) : (
                        <div className="mt-auto grid grid-cols-2 gap-3">
                          <Link
                            href={chatHref(m)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer flex items-center justify-center gap-2"
                          >
                            <FiMessageCircle size={18} /> Chat
                          </Link>
                          {m.mentor.whatsappLink ? (
                            <a
                              href={m.mentor.whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full bg-[#25D366] hover:bg-[#1fb857] text-white py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg cursor-pointer flex items-center justify-center gap-2"
                            >
                              <FiMessageCircle size={18} /> WhatsApp
                            </a>
                          ) : (
                            <button
                              disabled
                              className="w-full bg-slate-300 dark:bg-slate-700 text-white py-3.5 rounded-2xl font-bold cursor-not-allowed opacity-70 flex items-center justify-center gap-2"
                            >
                              <FiMessageCircle size={18} /> WhatsApp
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <section>
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Pending Requests</h3>

                {payError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <FiAlertCircle className="text-red-600" size={20} />
                    <p className="text-red-600 font-medium">{payError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {pendingRequests.map((req) => {
                    const mentorName = req.instructorId?.name ?? 'Mentor';
                    const accepted = req.status === 'accepted';
                    return (
                      <div
                        key={req._id}
                        className={`rounded-3xl p-6 border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs font-bold uppercase tracking-widest ${accepted ? 'text-emerald-500' : 'text-yellow-500'}`}>
                            {accepted ? 'Accepted — awaiting payment' : 'Awaiting response'}
                          </span>
                          <FiClock size={16} className={isDark ? 'text-slate-500' : 'text-gray-300'} />
                        </div>
                        <h4 className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{mentorName}</h4>
                        <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                          {req.skillCategory} • {req.skillLevel}
                        </p>
                        <p className={`text-sm mb-5 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>
                          Requested {new Date(req.createdAt).toLocaleDateString()}
                        </p>

                        {accepted && (req.availableTime || req.programDuration) && (
                          <div className={`rounded-xl p-4 mb-4 text-sm space-y-1 ${isDark ? 'bg-slate-700/60' : 'bg-blue-50'}`}>
                            <p className={`font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Program Schedule</p>
                            {req.availableTime && (
                              <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-medium">Available Time:</span> {req.availableTime}</p>
                            )}
                            {req.programDuration && (
                              <p className={isDark ? 'text-slate-300' : 'text-gray-700'}><span className="font-medium">Duration:</span> {req.programDuration}</p>
                            )}
                          </div>
                        )}

                        {accepted && req.paymentStatus === 'pending' && (req.actualPrice ?? req.instructorId?.mentorshipPrice) ? (
                          <button
                            onClick={() => handlePayNow(req)}
                            disabled={payingId === req._id}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                          >
                            {payingId === req._id ? <FiLoader className="animate-spin" size={18} /> : <FiCreditCard size={18} />}
                            Pay ₦{(req.actualPrice ?? req.instructorId.mentorshipPrice!).toLocaleString()}
                          </button>
                        ) : accepted ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700 text-sm">
                            Your mentor accepted! Check your email for the secure payment link to activate this mentorship.
                          </div>
                        ) : (
                          <div className={`rounded-xl p-4 text-sm ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-50 text-gray-600'}`}>
                            We&apos;ll notify you by email as soon as {mentorName} responds to your request.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Renew Mentorship Modal */}
      {selectedMentorship && (
        <RenewMentorshipModal
          isOpen={renewModalOpen}
          onClose={() => setRenewModalOpen(false)}
          mentorship={{
            requestId: selectedMentorship.requestId,
            mentor: selectedMentorship.mentor,
            originalAmount: selectedMentorship.amountPaid,
            originalDuration: selectedMentorship.programDuration
          }}
          onRenew={handleRenewMentorship}
        />
      )}

      {/* Report Instructor Modal */}
      {selectedInstructor && (
        <ReportInstructorModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          instructorId={selectedInstructor.id}
          instructorName={selectedInstructor.name}
          onSubmitReport={handleReportInstructor}
        />
      )}

      {/* Delete Mentorship Modal */}
      {selectedMentorship && (
        <DeleteMentorshipModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          mentorName={selectedMentorship.mentor.name}
          onConfirm={handleDeleteMentorship}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
