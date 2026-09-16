"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMessageCircle, FiInbox, FiUser } from 'react-icons/fi';
import InstructorSidebar from '@/app/components/InstructorSidebar';
import ChatThread from '@/app/components/chat/ChatThread';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { initializePusher } from '@/lib/pusher';
import { chatService, ChatConversation, ChatMessage } from '@/services/chat.service';
import { mentorService } from '@/services/mentor.service';
import Pusher, { Channel } from 'pusher-js';

const previewText = (message: ChatConversation['lastMessage']): string => {
  if (!message) return 'No messages yet';
  if (message.content) return message.content;
  return message.attachmentType === 'image' ? '📷 Image'
    : message.attachmentType === 'voice' ? '🎙 Voice note'
    : message.attachmentType === 'file' ? '📎 File'
    : 'New message';
};

const chatTime = (iso: string | null): string => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString()
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
};

export default function InstructorMentorshipPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const authUserId = user?._id ?? '';
  const activeRef = useRef<string | null>(null);

  useEffect(() => {
    activeRef.current = activeChatId;
  }, [activeChatId]);

  const loadChats = async () => {
    try {
      const [chatsRes, requestsRes] = await Promise.all([
        chatService.getInstructorChats(),
        mentorService.getMentorRequests().catch(() => null),
      ]);
      const chats = chatsRes.chats ?? [];
      setConversations(chats);
      setActiveChatId((prev) => prev ?? chats[0]?.chatId ?? null);
      setRequestCount(requestsRes?.requests?.filter((r) => r.status === 'pending').length ?? 0);
    } catch {
      setError('Could not load your mentorship chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => { if (!cancelled) loadChats(); }, 0);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // Subscribe to all conversation channels so messages arriving in any chat
  // update the list + unread badge live. Resubscribes when the list changes.
  useEffect(() => {
    if (!authUserId) return;

    let pusher: Pusher;
    const handles: { channel: Channel; hNew: typeof onControllerMessage; hUpdated: typeof onMessageUpdated; hDeleted: typeof onMessageDeleted }[] = [];

    const onControllerMessage = (payload: { chatId: string; message: ChatMessage }) => {
      const incoming = payload.message.senderType === 'user' && payload.chatId !== activeRef.current;

      setConversations((prev) => {
        const existing = prev.find((c) => c.chatId === payload.chatId);
        if (!existing) return prev;

        const updated: ChatConversation = {
          ...existing,
          lastMessageAt: payload.message.createdAt,
          lastMessage: {
            _id: payload.message._id,
            content: payload.message.content,
            attachmentType: payload.message.attachmentType,
            senderId: payload.message.senderId,
            senderType: payload.message.senderType,
            createdAt: payload.message.createdAt,
          },
          unreadCount: incoming ? existing.unreadCount + 1 : 0,
        };

        return [updated, ...prev.filter((c) => c.chatId !== payload.chatId)];
      });
    };

    // Live update the conversation preview when a message is edited within a chat.
    const onMessageUpdated = (payload: { chatId: string; message: ChatMessage }) => {
      setConversations((prev) => prev.map((c) =>
        c.chatId === payload.chatId && c.lastMessage?._id === payload.message._id
          ? { ...c, lastMessage: { ...c.lastMessage, content: payload.message.content } }
          : c
      ));
    };

    // If the deleted message is the conversation's last message, refresh the preview.
    const onMessageDeleted = (payload: { chatId: string; messageId: string }) => {
      setConversations((prev) => prev.map((c) =>
        c.chatId === payload.chatId && c.lastMessage?._id === payload.messageId
          ? { ...c, lastMessage: { ...c.lastMessage, content: null, attachmentType: null } }
          : c
      ));
    };

    try {
      pusher = initializePusher(authUserId);
    } catch {
      return;
    }

    conversations.forEach((c) => {
      try {
        const channel = pusher.subscribe(`private-chat-${c.chatId}`);
        channel.bind('new-message', onControllerMessage);
        channel.bind('message-updated', onMessageUpdated);
        channel.bind('message-deleted', onMessageDeleted);
        handles.push({ channel, hNew: onControllerMessage, hUpdated: onMessageUpdated, hDeleted: onMessageDeleted });
      } catch {
        // ignore
      }
    });

    return () => {
      // Unbind only the handlers WE bound. The channels are shared with the
      // open ChatThread (same pusher-js channel object), so a blanket unbind()
      // or unsubscribe() here would silently kill its real-time updates.
      handles.forEach(({ channel, hNew, hUpdated, hDeleted }) => {
        try {
          channel.unbind('new-message', hNew);
          channel.unbind('message-updated', hUpdated);
          channel.unbind('message-deleted', hDeleted);
        } catch {
          // ignore
        }
      });
    };
  }, [authUserId, conversations]);

  const selectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMobileListOpen(false);
    setConversations((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, unreadCount: 0 } : c)));
  };

  const activeChat = conversations.find((c) => c.chatId === activeChatId) ?? null;

  const panelBorder = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';

  return (
    <>
    <div className={`flex min-h-screen font-poppins ${isDark ? 'bg-slate-900' : 'bg-[#FDFDFD]'}`}>
      <InstructorSidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePath="/instructor/mentorship"
        onLogout={async () => {
          await logout();
          window.location.href = '/get-started';
        }}
      />

      <main className={`grow p-5 lg:p-10 overflow-y-auto w-full ${isDark ? 'text-white' : 'text-[#111827]'}`}>
        <header className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl lg:text-2xl font-medium">Mentorship</h2>
            <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
              Chat with the students you mentor
            </p>
          </div>
          <Link href="/instructor/mentor-requests"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
              isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
            }`}>
            <FiInbox size={16} />
            Mentor Requests
            {requestCount > 0 && (
              <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">{requestCount}</span>
            )}
          </Link>
        </header>

        {error && (
          <div className={`rounded-2xl p-4 mb-6 text-red-500 font-medium ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>{error}</div>
        )}

        {/* ── Chat layout ─────────────────────────────────────────── */}
        <div className={`grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 rounded-3xl border shadow-sm overflow-hidden h-[calc(100vh-190px)] ${panelBorder}`}>
          {/* Conversation list — desktop sidebar (hidden on mobile, dropdown instead) */}
          <div className={`hidden lg:flex border-r ${isDark ? 'border-slate-700' : 'border-slate-100'} flex-col min-h-0`}>
            <div className={`px-4 py-3.5 text-sm font-bold border-b ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-gray-600'}`}>
              Students
            </div>

            <div className="grow overflow-y-auto no-scrollbar min-h-0">
              {loading && (
                <div className="p-3 space-y-2" aria-busy="true" aria-label="Loading conversations">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-3">
                      <div className={`w-11 h-11 rounded-full shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className={`h-3.5 w-28 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                        <div className={`h-3 w-40 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && conversations.length === 0 && (
                <div className="p-8 text-center">
                  <FiMessageCircle size={28} className="mx-auto mb-3 text-blue-400" />
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>No mentored students yet</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Students you mentor will appear here once they pay for your mentorship.
                  </p>
                </div>
              )}

              {conversations.map((conv) => {
                const isActive = conv.chatId === activeChatId;
                return (
                  <button key={conv.chatId} onClick={() => selectChat(conv.chatId)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      isActive ? (isDark ? 'bg-slate-700/70' : 'bg-blue-50') : 'hover:bg-slate-500/5'
                    }`}>
                    {conv.participant?.profilePicture ? (
                      <Image width={44} height={44} src={conv.participant.profilePicture} alt={conv.participant.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {(conv.participant?.name ?? 'S').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {conv.participant?.name ?? 'Student'}
                        </p>
                        {conv.lastMessageAt && (
                          <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{chatTime(conv.lastMessageAt)}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{previewText(conv.lastMessage)}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active conversation */}
          <div className="min-h-0 flex flex-col">
            {/* Mobile: conversation dropdown toggler */}
            <div className={`lg:hidden flex items-center gap-2 px-4 py-2.5 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
              <button
                onClick={() => setMobileListOpen((o) => !o)}
                className={`flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition-colors ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-gray-900'
                }`}
              >
                <span className="truncate">{activeChat?.participant?.name ?? 'Select a student…'}</span>
                <span className={`shrink-0 transition-transform ${mobileListOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col h-full" aria-busy="true" aria-label="Loading chat">
                {/* Header skeleton */}
                <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className={`w-10 h-10 rounded-full shrink-0 animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  <div className="space-y-2">
                    <div className={`h-3.5 w-32 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                    <div className={`h-3 w-24 rounded animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {/* Message bubbles skeleton */}
                <div className="grow overflow-y-auto px-5 py-4 space-y-4">
                  {[60, 40, 70, 50, 80, 45].map((w, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`h-10 rounded-2xl animate-pulse ${i % 2 === 0 ? (isDark ? 'bg-slate-700' : 'bg-gray-300') : (isDark ? 'bg-slate-600' : 'bg-gray-200')}`}
                        style={{ width: `${w}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Composer skeleton */}
                <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className={`h-12 rounded-2xl animate-pulse ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                </div>
              </div>
            ) : activeChat ? (
              <ChatThread
                key={activeChat.chatId}
                chatId={activeChat.chatId}
                participant={activeChat.participant}
                mySenderType="instructor"
                isDark={isDark}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <FiUser size={36} className="mb-3 text-blue-400" />
                <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Select a student to start chatting</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {conversations.length > 0 ? 'Choose a conversation on the left.' : 'Your mentored students will show up here.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: conversation list dropdown modal */}
        {mobileListOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileListOpen(false)}>
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-hidden rounded-t-3xl shadow-2xl flex flex-col ${isDark ? 'bg-slate-800' : 'bg-white'}`}
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Students</p>
                <button
                  onClick={() => setMobileListOpen(false)}
                  className={`p-1 rounded-full transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="grow overflow-y-auto no-scrollbar min-h-0">
                {conversations.map((conv) => {
                  const isActive = conv.chatId === activeChatId;
                  return (
                    <button key={conv.chatId} onClick={() => selectChat(conv.chatId)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                        isActive ? (isDark ? 'bg-slate-700/70' : 'bg-blue-50') : 'hover:bg-slate-500/5'
                      }`}>
                      {conv.participant?.profilePicture ? (
                        <Image width={44} height={44} src={conv.participant.profilePicture} alt={conv.participant.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {(conv.participant?.name ?? 'S').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {conv.participant?.name ?? 'Student'}
                          </p>
                          {conv.lastMessageAt && (
                            <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{chatTime(conv.lastMessageAt)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{previewText(conv.lastMessage)}</p>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0">{conv.unreadCount}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {!loading && conversations.length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-400">No mentored students yet</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>

    <style jsx global>{`
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
    </>
  );
}