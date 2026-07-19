"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { instructorService } from '@/services/instructor.service';
import { Instructor } from '@/types';
import { ConfirmActionModal } from '@/app/components/ConfirmActionModal';

export default function ManageInstructorsPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  type PendingAction = { type: 'verify' | 'reject'; instructorId: string; name: string };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await instructorService.getAllInstructors();
      setInstructors(response.instructors || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (instructor: Instructor) => {
    setPendingAction({ type: 'verify', instructorId: instructor._id, name: instructor.name });
  };

  const handleReject = (instructor: Instructor) => {
    setPendingAction({ type: 'reject', instructorId: instructor._id, name: instructor.name });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;
    const { type, instructorId } = pendingAction;
    setActionLoading(instructorId);
    try {
      if (type === 'verify') {
        await instructorService.verifyInstructor(instructorId);
      } else {
        await instructorService.rejectInstructor(instructorId);
      }
      await fetchInstructors();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${type} instructor`);
    } finally {
      setActionLoading(null);
      setPendingAction(null);
    }
  };

  const formatTimeAgo = (date: Date | string | undefined) => {
    if (!date) return 'Recently';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4 cursor-pointer">
            <FiArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
            Manage Instructors
          </h1>
          <p className="text-slate-600 mt-2">
            Review and manage instructor applications
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Instructors List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="animate-spin text-slate-400" size={24} />
            </div>
          ) : instructors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-slate-500 text-sm">No instructor applications found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {instructors.map((instructor) => (
                <div key={instructor._id} className="p-4 lg:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {instructor.profilePicture ? (
                        <img 
                          src={instructor.profilePicture} 
                          alt={instructor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-600 font-bold">{instructor.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800 text-sm lg:text-base truncate">{instructor.name}</h4>
                        {instructor.isVerified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 md:text-base truncate">{instructor.email}</p>
                      <p className="text-xs text-slate-400 mt-1">{instructor.specialization || 'No specialization'}</p>
                      <p className="text-xs text-slate-400 mt-1">Applied {formatTimeAgo(instructor.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!instructor.isVerified && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(instructor)}
                          disabled={actionLoading === instructor._id}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Accept"
                        >
                          {actionLoading === instructor._id ? (
                            <FiLoader className="animate-spin" size={18} />
                          ) : (
                            <FiCheckCircle size={18} />
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(instructor)}
                          disabled={actionLoading === instructor._id}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Reject"
                        >
                          {actionLoading === instructor._id ? (
                            <FiLoader className="animate-spin" size={18} />
                          ) : (
                            <FiAlertCircle size={18} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmActionModal
        isOpen={pendingAction?.type === 'verify'}
        title="Verify Instructor"
        message={`Are you sure you want to verify ${pendingAction?.name ?? 'this instructor'}? They will gain full instructor access on the platform.`}
        confirmText="Yes, Verify"
        cancelText="Cancel"
        variant="confirm"
        isLoading={actionLoading === pendingAction?.instructorId}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />

      <ConfirmActionModal
        isOpen={pendingAction?.type === 'reject'}
        title="Reject Instructor"
        message={`Are you sure you want to reject ${pendingAction?.name ?? 'this instructor'}? This action will deny their application.`}
        confirmText="Yes, Reject"
        cancelText="Cancel"
        variant="danger"
        isLoading={actionLoading === pendingAction?.instructorId}
        onConfirm={handleConfirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
