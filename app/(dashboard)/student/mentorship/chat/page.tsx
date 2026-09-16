"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiMessageCircle, FiLoader } from 'react-icons/fi';
import StudentSidebar from '@/app/components/StudentSidebar';
import ChatThread from '@/app/components/chat/ChatThread';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { mentorService, StudentMentorship } from '@/services/mentor.service';
import { initializePusher } from '@/lib/pusher';
import { chatService, ChatConversation, ChatMessage } from '@/services/chat.service';
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

interface ChatRow {
  requestId: string;
  mentor: StudentMentorship['mentor'];
  conv?: ChatConversation;
}

function StudentChatPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ChatRow[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileListOpen, setMobileListOpen] = useState(false);
  const [resolvingChat, setResolvingChat] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const authUserId = user?._id ?? '';
  const searchParams = useSearchParams();
  const activeRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    activeRef.current = activeChatId;
  }, [activeChatId]);

  // Open (or lazily create) the chat for a selected mentor.
  const openChat = useCallback(async (requestId: string) => {
    setActiveRequestId(requestId);
    setMobileListOpen(false);
    const existing = conversations.find((c) => c.mentorshipId === requestId);
    if (existing) {
      setActiveChatId(existing.chatId);
      setConversations((prev) => prev.map((c) => (c.mentorshipId === requestId ? { ...c, unreadCount: 0 } : c)));
      return;
    }

    setResolvingChat(true);
    setActiveChatId(null);
    try {
      const res = await chatService.resolveChat(requestId);
      if (res.status === 'success' && res.chat?.chatId) {
        const mentor = rows.find((r) => r.requestId === requestId)?.mentor;
        const conv: ChatConversation = {
          chatId: res.chat.chatId,
          mentorshipId: requestId,
          participant: { _id: mentor?._id ?? '', name: mentor?.name ?? 'Mentor', profilePicture: mentor?.profilePicture },
          lastMessageAt: null,
          lastMessage: null,
          unreadCount: 0,
        };
        setConversations((prev) => (prev.some((c) => c.chatId === conv.chatId) ? prev : [...prev, conv]));
        setRows((prev) => prev.map((r) => (r.requestId === requestId ? { ...r, conv } : r)));
        setActiveChatId(conv.chatId);

        // Refresh full conversation metadata (last message, unread count) so
        // the list previews are accurate for previously-opened chats.
        chatService.getStudentChats().then((r) => {
          setConversations(r.chats ?? []);
        }).catch(() => {});
      } else {
        setError('Could not open the chat. Please try again.');
      }
    } catch {
      setError('Could not open the chat. Please try again.');
    } finally {
      setResolvingChat(false);
    }
  }, [conversations, rows]);

  const load = async () => {
    try {
      const [mentorshipsRes, chatsRes] = await Promise.all([
        mentorService.getMyMentorships().catch(() => null),
        chatService.getStudentChats().catch(() => ({ chats: [] as ChatConversation[] })),
      ]);
      const mentorships = (mentorshipsRes?.mentorships ?? []).filter((m) => m.status !== 'ended');
      const chats = chatsRes?.chats ?? [];
      setConversations(chats);

      const rows: ChatRow[] = mentorships.map((m) => ({
        requestId: m.requestId,
        mentor: m.mentor,
        conv: chats.find((c) => c.mentorshipId === m.requestId),
      }));
      // Default to the most recently active conversation, else the first mentor.
      const active =
        searchParams.get('mentorship') ||
        [...rows].sort((a, b) => (b.conv?.lastMessageAt ?? '').localeCompare(a.conv?.lastMessageAt ?? ''))[0]?.requestId ||
        null;
      setRows(rows);
      setActiveRequestId(active ? rows.some((r) => r.requestId === active) ? active : rows[0]?.requestId ?? null : null);
      if (active && rows.some((r) => r.requestId === active)) {
        openChat(active);
      }
    } catch {
      setError('Could not load your chats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => { if (!cancelled) load(); }, 0);
    return () => { cancelled = true; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subscribe to conversation channels so the list + unread badges update live.
  useEffect(() => {
    if (!authUserId) return;

    let pusher: Pusher;
    const handles: { channel: Channel; hNew: typeof onControllerMessage; hUpdated: typeof onMessageUpdated; hDeleted: typeof onMessageDeleted }[] = [];

    const onControllerMessage = (payload: { chatId: string; message: ChatMessage }) => {
      const chat = conversations.find((c) => c.chatId === payload.chatId);
      if (!chat) return;

      const incoming = payload.message.senderType === 'instructor' && payload.chatId !== activeRef.current;

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

      setRows((prev) => prev.map((r) => {
        if (r.requestId !== chat.mentorshipId || !chat) return r;
        return {
          ...r,
          conv: {
            chatId: chat.chatId,
            mentorshipId: chat.mentorshipId,
            participant: r.conv?.participant ?? { _id: '', name: r.mentor.name, profilePicture: r.mentor.profilePicture },
            lastMessageAt: payload.message.createdAt,
            lastMessage: {
              _id: payload.message._id,
              content: payload.message.content,
              attachmentType: payload.message.attachmentType,
              senderId: payload.message.senderId,
              senderType: payload.message.senderType,
              createdAt: payload.message.createdAt,
            },
            unreadCount: incoming ? (r.conv?.unreadCount ?? 0) + 1 : 0,
          },
        };
      }));
    };

    // Live update the conversation preview when a message is edited.
    const onMessageUpdated = (payload: { chatId: string; message: ChatMessage }) => {
      setConversations((prev) => prev.map((c) =>
        c.chatId === payload.chatId && c.lastMessage?._id === payload.message._id
          ? { ...c, lastMessage: { ...c.lastMessage, content: payload.message.content } }
          : c
      ));
      setRows((prev) => prev.map((r) =>
        r.conv?.chatId === payload.chatId && r.conv.lastMessage?._id === payload.message._id
          ? { ...r, conv: { ...r.conv, lastMessage: { ...r.conv.lastMessage, content: payload.message.content } } }
          : r
      ));
    };

    // Clear the preview if the deleted message was the last one.
    const onMessageDeleted = (payload: { chatId: string; messageId: string }) => {
      setConversations((prev) => prev.map((c) =>
        c.chatId === payload.chatId && c.lastMessage?._id === payload.messageId
          ? { ...c, lastMessage: { ...c.lastMessage, content: null, attachmentType: null } }
          : c
      ));
      setRows((prev) => prev.map((r) =>
        r.conv?.chatId === payload.chatId && r.conv.lastMessage?._id === payload.messageId
          ? { ...r, conv: { ...r.conv, lastMessage: { ...r.conv.lastMessage, content: null, attachmentType: null } } }
          : r
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

  // Re-sync rows when conversations change so previews stay fresh.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setRows((prev) => prev.map((r) => {
        const conv = conversations.find((c) => c.mentorshipId === r.requestId);
        return conv ? { ...r, conv } : r;
      }));
    }, 0);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [conversations]);

  const activeRow = rows.find((r) => r.requestId === activeRequestId) ?? null;
  const panelBorder = isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100';

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

      <main className={`grow p-5 lg:p-6 overflow-y-auto w-full lg:ml-72 min-w-0 z-10 relative ${isDark ? 'text-white' : 'text-[#111827]'}`}>
        <header className="mb-5 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/student/mentorship"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors cursor-pointer ${
                isDark ? 'border-slate-600 hover:bg-slate-700' : 'border-slate-200 hover:bg-slate-50'
              }`}>
              <FiArrowLeft size={16} />
              Mentorships
            </Link>
            <div>
              <h2 className="text-xl lg:text-2xl font-medium">Messages</h2>
              <p className={`text-xs lg:text-[15px] ${isDark ? 'text-slate-400' : 'text-[#111827]'}`}>
                Chat with your mentors
              </p>
            </div>
          </div>
        </header>

        {error && (
          <div className={`rounded-2xl p-4 mb-6 text-red-500 font-medium ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>{error}</div>
        )}

        {/* ── WhatsApp-style chat layout ─────────────────────────── */}
        <div className={`grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 rounded-3xl border shadow-sm overflow-hidden h-[calc(100vh-190px)] ${panelBorder}`}>
          {/* Mentor / people list — desktop sidebar (hidden on mobile, dropdown instead) */}
          <div className={`hidden lg:flex border-r ${isDark ? 'border-slate-700' : 'border-slate-100'} flex-col min-h-0`}>
            <div className={`px-4 py-3.5 text-sm font-bold border-b ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-100 text-gray-600'}`}>
              Mentors
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

              {!loading && rows.length === 0 && (
                <div className="p-8 text-center">
                  <FiMessageCircle size={28} className="mx-auto mb-3 text-blue-400" />
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>No mentors yet</p>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Your accepted mentorship programs will show up here.
                  </p>
                </div>
              )}

              {rows.map((row) => {
                const isActive = row.requestId === activeRequestId;
                const unread = row.conv?.unreadCount ?? 0;
                return (
                  <button key={row.requestId} onClick={() => openChat(row.requestId)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                      isActive ? (isDark ? 'bg-slate-700/70' : 'bg-blue-50') : 'hover:bg-slate-500/5'
                    }`}>
                    {row.mentor.profilePicture ? (
                      <Image width={44} height={44} src={row.mentor.profilePicture} alt={row.mentor.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {row.mentor.name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {row.mentor.name}
                        </p>
                        {row.conv?.lastMessageAt && (
                          <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{chatTime(row.conv.lastMessageAt)}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{previewText(row.conv?.lastMessage ?? null)}</p>
                        {unread > 0 && (
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0">{unread}</span>
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
                <span className="truncate">{activeRow?.mentor.name ?? 'Select a mentor…'}</span>
                <span className={`shrink-0 transition-transform ${mobileListOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
            </div>

            {resolvingChat ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-sm">
                <FiLoader className="animate-spin text-blue-500" size={22} />
                <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Opening conversation…</p>
              </div>
            ) : activeChatId ? (
              <ChatThread
                key={activeChatId}
                chatId={activeChatId}
                participant={activeRow ? { name: activeRow.mentor.name, profilePicture: activeRow.mentor.profilePicture } : null}
                mySenderType="user"
                isDark={isDark}
              />
            ) : !loading && rows.length > 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <FiMessageCircle size={36} className="mb-3 text-blue-400" />
                <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Select a mentor to start chatting</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Choose a conversation on the left.</p>
              </div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-2" aria-busy="true">
                <FiLoader className="animate-spin text-blue-500" size={22} />
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Loading…</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <FiMessageCircle size={36} className="mb-3 text-blue-400" />
                <p className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>No active programs yet</p>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Browse mentors to start a mentorship.</p>
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
                <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Mentors</p>
                <button
                  onClick={() => setMobileListOpen(false)}
                  className={`p-1 rounded-full transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="grow overflow-y-auto no-scrollbar min-h-0">
                {rows.map((row) => {
                  const isActive = row.requestId === activeRequestId;
                  const unread = row.conv?.unreadCount ?? 0;
                  return (
                    <button key={row.requestId} onClick={() => openChat(row.requestId)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors cursor-pointer ${
                        isActive ? (isDark ? 'bg-slate-700/70' : 'bg-blue-50') : 'hover:bg-slate-500/5'
                      }`}>
                      {row.mentor.profilePicture ? (
                        <Image width={44} height={44} src={row.mentor.profilePicture} alt={row.mentor.name}
                          className="w-11 h-11 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {row.mentor.name.split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {row.mentor.name}
                          </p>
                          {row.conv?.lastMessageAt && (
                            <span className={`text-[10px] shrink-0 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{chatTime(row.conv.lastMessageAt)}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{previewText(row.conv?.lastMessage ?? null)}</p>
                          {unread > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0">{unread}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {!loading && rows.length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-400">No mentors yet</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default function StudentChatPageWrapper() {
  return (
    <Suspense fallback={null}>
      <StudentChatPage />
    </Suspense>
  );
}