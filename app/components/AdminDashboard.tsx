"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiGrid, FiUsers, FiBook, FiDollarSign,
  FiSettings, FiBell, FiPlus, FiMoreHorizontal, FiArrowUpRight, FiMenu, FiX, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiLoader
} from 'react-icons/fi';
import { DashboardHeader } from './constants/Admin/DashboardHeader';
import { SidebarNavContent } from './constants/Admin/SidebarNavContent';
import { StatCard } from './constants/Admin/statcards';
import { NotificationsContent } from './constants/Admin/NotificationsContent';
import { instructorService } from '@/services/instructor.service';
import { Instructor } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { activityTracker } from '@/utils/activityTracker';
import { ConfirmActionModal } from './ConfirmActionModal';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const { isAuthenticated, userType } = useAuthStore();

  // ── Confirm modal state ──────────────────────────────────────────────────
  type PendingAction = { type: 'verify' | 'reject'; instructorId: string; name: string };
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const handleAddAdmin = () => {
    // Navigate to add admin page
    window.location.href = '/admin/add-admin';
  };

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      fetchPendingInstructors();
      setActivities(activityTracker.getFormattedActivities());
    } else {
      setLoadingInstructors(false);
    }
  }, [isAuthenticated, userType]);

  const fetchPendingInstructors = async () => {
    setLoadingInstructors(true);
    try {
      const response = await instructorService.getAllInstructors();
      const pendingInstructors = response.instructors.filter((inst: Instructor) => !inst.isVerified).slice(0, 3);
      setInstructors(pendingInstructors);
    } catch (error) {
      console.error('Failed to fetch instructors:', error);
    } finally {
      setLoadingInstructors(false);
    }
  };

  // Opens modal; actual API call happens in handleConfirmAction
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
      await fetchPendingInstructors();
    } catch (error) {
      console.error(`Failed to ${type} instructor:`, error);
    } finally {
      setActionLoading(null);
      setPendingAction(null);
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };



  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B] overflow-x-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-60 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-white border-r border-slate-200 fixed h-full z-70 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Myteacher Institute Logo" className="w-45 h-10 object-contain" />
          </div>
          <button
            className="lg:hidden p-1.5 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNavContent />
        </div>
      </aside>

      <main className="lg:ml-64 flex-1 flex flex-col min-w-0 z-10 relative">
        <DashboardHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          notifyOpen={notifyOpen}
          setNotifyOpen={setNotifyOpen}
          NotificationsContent={NotificationsContent}
        />

        <div className="p-4 md:p-6 lg:p-8 max-w-full lg:max-w-7xl mx-auto w-full">
          {/* STATS */}
          <div className="flex lg:grid lg:grid-cols-4 gap-3 lg:gap-6 mb-8 lg:mb-10 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide snap-x">
            <StatCard
              label="Total Users"
              value="12,548"
              icon={<FiUsers size={20} strokeWidth={2.5} />}
              iconBgColor="bg-blue-500"
            />
            <StatCard
              label="Active Instructors"
              value="156"
              icon={<FiBook size={20} strokeWidth={2.5} />}
              iconBgColor="bg-green-500"
            />
            <StatCard
              label="Total Courses"
              value="324"
              icon={<FiGrid size={20} strokeWidth={2.5} />}
              iconBgColor="bg-purple-500"
            />
            <StatCard
              label="Monthly Revenue"
              value="₦45.2M"
              icon={<FiDollarSign size={20} strokeWidth={2.5} />}
              iconBgColor="bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* LEFT: MAIN CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Pending Instructor Applications
                </h3>
                <Link href="/admin/manage-instructors" className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">
                  View All
                </Link>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {loadingInstructors ? (
                    <div className="flex items-center justify-center py-12">
                      <FiLoader className="animate-spin text-slate-400" size={24} />
                    </div>
                  ) : instructors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <p className="text-slate-500 text-sm">No pending instructor applications</p>
                    </div>
                  ) : (
                    instructors.map((instructor) => (
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
                            <h4 className="font-semibold text-slate-800 text-sm lg:text-base truncate">{instructor.name}</h4>
                            <p className="text-xs text-slate-500 truncate">{instructor.email}</p>
                            <p className="text-xs text-slate-400 mt-1">{instructor.specialization || 'No specialization'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-400">{formatTimeAgo(instructor.createdAt as any)}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerify(instructor)}
                              disabled={actionLoading === instructor._id}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                            >
                              {actionLoading === instructor._id ? (
                                <FiLoader className="animate-spin" size={18} />
                              ) : (
                                <FiAlertCircle size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6 mt-8">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Recent Activity
                </h3>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 lg:p-6">
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No recent activities</p>
                  ) : (
                    activities.slice(0, 4).map((activity) => {
                      const iconMap: Record<string, any> = {
                        'New instructor application': FiUsers,
                        'Course approved': FiCheckCircle,
                        'Revenue milestone': FiTrendingUp,
                        'User registration spike': FiUsers,
                        'default': FiUsers,
                      };
                      const colorMap: Record<string, string> = {
                        'New instructor application': 'bg-blue-100 text-blue-600',
                        'Course approved': 'bg-green-100 text-green-600',
                        'Revenue milestone': 'bg-purple-100 text-purple-600',
                        'User registration spike': 'bg-yellow-100 text-yellow-600',
                        'default': 'bg-blue-100 text-blue-600',
                      };
                      const Icon = iconMap[activity.action] || iconMap['default'];
                      const color = colorMap[activity.action] || colorMap['default'];

                      return (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg ${color} shrink-0`}>
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-slate-800 text-sm">{activity.action}</h4>
                            <p className="text-xs text-slate-500 mt-1">{activity.detail}</p>
                            <span className="text-[10px] text-slate-400 mt-1">{activity.time}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-4 hidden lg:flex flex-col gap-10">
              <div className="bg-blue-600 rounded-4xl p-8 shadow-xl shadow-blue-100">
                <h3 className="text-white font-black text-xl mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer"
                    onClick={handleAddAdmin}
                  >
                    <FiPlus size={18} />
                    <span className="font-medium text-sm">Add New Admin</span>
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer">
                    <FiBook size={18} />
                    <span className="font-medium text-sm">Review Courses</span>
                  </button>
                  <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl flex items-center gap-3 transition-colors cursor-pointer">
                    <FiDollarSign size={18} />
                    <span className="font-medium text-sm">View Revenue</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">
                  Notifications
                </h3>
                <NotificationsContent />
              </div>
            </div>
          </div>

          <div className="lg:hidden mt-12 pb-10">
            <h3 className="text-lg lg:text-xl font-black text-slate-800 mb-6 tracking-tight">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer">
                <FiPlus size={18} />
                <span className="font-medium text-sm">Add New Admin</span>
              </button>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-3 cursor-pointer">
                <FiBook size={18} />
                <span className="font-medium text-sm">Review Courses</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-center {
          scroll-snap-align: center;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Verify confirmation modal */}
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

      {/* Reject confirmation modal */}
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
