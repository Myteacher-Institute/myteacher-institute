"use client";

import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiBell, FiCheck, FiTrash2, FiCheckCircle, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme.store";
import { notificationService, Notification } from "@/services/notification.service";

export default function NotificationsPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await notificationService.getNotifications(20, 0);
      if (res.status === "success" && res.notifications) {
        setNotifications(res.notifications);
      } else {
        setError(res.message || "Failed to load notifications");
      }
    } catch (err) {
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.status === "success") {
        setUnreadCount(res.count || 0);
      }
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      const deletedNotification = notifications.find(n => n._id === id);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'course':
      case 'enrollment':
        return <FiCheckCircle className="text-blue-500" />;
      case 'achievement':
        return <FiCheckCircle className="text-yellow-500" />;
      case 'system':
        return <FiBell className="text-purple-500" />;
      case 'reminder':
        return <FiBell className="text-orange-500" />;
      case 'payment':
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const getNotificationBg = (type: Notification['type']) => {
    switch (type) {
      case 'course':
      case 'enrollment':
        return isDark ? 'bg-blue-500/20' : 'bg-blue-100';
      case 'achievement':
        return isDark ? 'bg-yellow-500/20' : 'bg-yellow-100';
      case 'system':
        return isDark ? 'bg-purple-500/20' : 'bg-purple-100';
      case 'reminder':
        return isDark ? 'bg-orange-500/20' : 'bg-orange-100';
      case 'payment':
        return isDark ? 'bg-green-500/20' : 'bg-green-100';
      default:
        return isDark ? 'bg-gray-500/20' : 'bg-gray-100';
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-[#1E293B]'}`}>
      {/* Header */}
      <header className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50 ${isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-lg cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
          >
            <FiArrowLeft size={20} className={isDark ? 'text-slate-300' : 'text-slate-700'} />
          </button>
          <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`}>
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadNotifications}
            disabled={loading}
            className={`p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
            title="Refresh"
          >
            <FiRefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${
              isDark 
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mark all as read
          </button>
        </div>
      </header>

      {/* Notifications List */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`rounded-2xl border p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 w-3/4 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`h-3 w-1/2 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <p className="text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={loadNotifications}
              className={`px-4 py-2 rounded-lg font-bold text-sm cursor-pointer ${
                isDark ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Try Again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <FiBell size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`rounded-2xl border p-4 transition-all ${
                  !notification.read 
                    ? isDark 
                      ? 'bg-slate-800 border-blue-500/30' 
                      : 'bg-white border-blue-200'
                    : isDark 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${getNotificationBg(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-bold text-sm ${!notification.read ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-slate-300' : 'text-slate-600')}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isDark ? 'bg-blue-400' : 'bg-blue-500'}`} />
                      )}
                    </div>
                    <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {formatTime(notification.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            title="Mark as read"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}