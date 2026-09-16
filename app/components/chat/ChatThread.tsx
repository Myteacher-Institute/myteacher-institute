"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { FiMic, FiPaperclip, FiLoader, FiSend, FiX, FiMoreVertical, FiEdit, FiTrash2, FiCheck, FiFile, FiRefreshCw } from 'react-icons/fi';
import Pusher, { Channel } from 'pusher-js';
import { chatService, ChatMessage, resolveAssetUrl, compressImageToDataUrl } from '@/services/chat.service';
import { savePendingMessage, getPendingMessages, removePendingMessage, PendingChatPayload } from '@/services/chatQueue';
import { initializePusher } from '@/lib/pusher';
import { useAuthStore } from '@/store/auth.store';
import { triggerNotificationFeedback } from '@/utils/notificationAudio';

interface ChatThreadProps {
  chatId: string;
  participant?: { name: string; profilePicture?: string } | null;
  mySenderType: 'user' | 'instructor';
  isDark: boolean;
  onNewMessage?: (message: ChatMessage) => void;
}

const timeLabel = (iso: string): string => {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export default function ChatThread({ chatId, participant, mySenderType, isDark, onNewMessage }: ChatThreadProps) {
  const { user: authUser } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [composerError, setComposerError] = useState('');
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [editDraft, setEditDraft] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const activeChatId = useRef<string>(chatId);
  const authUserId = authUser?._id ?? '';

  useEffect(() => {
    activeChatId.current = chatId;

    let cancelled = false;
    chatService.getMessages(chatId)
      .then((thread) => {
        if (cancelled) return;
        const msgs = thread.messages ?? [];
        setMessages(msgs);
        // File attachments are stored in GridFS — their base64 data is returned
        // per message, so hydrate each one on demand.
        for (const m of msgs) {
          if (m.attachmentType === 'file' && !m.attachmentData && !m.attachmentUrl) {
            chatService.getMessage(chatId, m._id)
              .then((res) => {
                if (cancelled) return;
                setMessages((prev) => prev.map((x) => (x._id === res.message._id ? res.message : x)));
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {
        if (cancelled) return;
        setComposerError('Could not load this conversation');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [chatId]);

  // Auto-grow the composer textarea (max 300px, no scrollbar)
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
  };

  // Scroll to latest message
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  // Live updates over Pusher
  useEffect(() => {
    if (!authUserId) return;

    let pusher: Pusher;

    try {
      pusher = initializePusher(authUserId);
    } catch {
      return;
    }

    const channel: Channel = pusher.subscribe(`private-chat-${chatId}`);

    const onMessageUpdated = (payload: { chatId: string; message: ChatMessage }) => {
      if (payload.chatId !== activeChatId.current) return;
      if (payload.message.attachmentType && !payload.message.attachmentData) {
        chatService.getMessage(chatId, payload.message._id)
          .then((res) => {
            setMessages((prev) => prev.map((m) => (m._id === res.message._id ? res.message : m)));
          })
          .catch(() => {});
        return;
      }
      setMessages((prev) => prev.map((m) => (m._id === payload.message._id ? { ...m, ...payload.message } : m)));
    };

    const onMessageDeleted = (payload: { chatId: string; messageId: string; mode: 'me' | 'general'; deletedBy?: string }) => {
      if (payload.chatId !== activeChatId.current) return;
      // "me" deletions are scoped per-user, so only honour them for the initiator.
      if (payload.mode === 'me' && payload.deletedBy !== authUserId) return;
      setMessages((prev) =>
        payload.mode === 'general'
          ? prev.map((m) => (m._id === payload.messageId ? { ...m, isDeleted: true, content: null, attachmentData: null, attachmentUrl: null, attachmentType: null } : m))
          : prev.filter((m) => m._id !== payload.messageId)
      );
    };

    channel.bind('message-updated', onMessageUpdated);
    channel.bind('message-deleted', onMessageDeleted);

    const onChatMessage = (payload: { chatId: string; message: ChatMessage }) => {
      if (payload.chatId !== activeChatId.current) return;

      const incoming = payload.message;
      const isIncoming =
        (mySenderType === 'instructor' && incoming.senderType === 'user') ||
        (mySenderType === 'user' && incoming.senderType === 'instructor');

      // Play the notification sound when a new chat message arrives.
      if (isIncoming) triggerNotificationFeedback('info');

      // Pusher omits base64 attachmentData (payload cap), so for attachment
      // messages arriving in real time we fetch the full message by id.
      if (!incoming.attachmentData && (incoming.attachmentType === 'image' || incoming.attachmentType === 'voice' || incoming.attachmentType === 'file')) {
        chatService
          .getMessage(chatId, incoming._id)
          .then((res) => {
            const full = res.message;
            setMessages((prev) => {
              if (prev.some((m) => m._id === full._id)) return prev.map((m) => (m._id === full._id ? full : m));
              return [...prev, full];
            });
          })
          .catch(() => {
            setMessages((prev) => (prev.some((m) => m._id === incoming._id) ? prev : [...prev, incoming]));
          });
        onNewMessage?.(incoming);
        return;
      }

      setMessages((prev) => {
        if (prev.some((m) => m._id === incoming._id)) return prev;
        return [...prev, incoming];
      });
      onNewMessage?.(incoming);
    };
    channel.bind('new-message', onChatMessage);

    // User-scoped channel receives "delete for me" events for this user.
    let userChannel: Channel | null = null;
    try {
      userChannel = pusher.subscribe(`private-user-${authUserId}`);
      userChannel.bind('message-deleted', onMessageDeleted);
    } catch {
      // ignore
    }

    return () => {
      try {
        // Unbind ONLY our own handlers — this channel is shared with the page's
        // conversation list (and private-user with SocketProvider). A blanket
        // `unbind(event)` or `unsubscribe()` here would silently kill their
        // live handlers too (`unexpected Turbopack` symptoms).
        channel.unbind('new-message', onChatMessage);
        channel.unbind('message-updated', onMessageUpdated);
        channel.unbind('message-deleted', onMessageDeleted);
        if (userChannel) {
          userChannel.unbind('message-deleted', onMessageDeleted);
        }
      } catch {
        // ignore
      }
    };
  }, [chatId, authUserId, onNewMessage, mySenderType]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
  }, []);

  // ——— Offline queue: messages that failed to send (no internet) are stored in
  // IndexedDB and re-sent automatically once connectivity is restored. ————

  const isNetworkError = (error: unknown): boolean => {
    const e = error as { response?: unknown };
    return !e.response;
  };

  const refreshPendingCount = async () => {
    try {
      const pending = await getPendingMessages(chatId);
      setPendingCount(pending.length);
    } catch {
      setPendingCount(0);
    }
  };

  const syncPending = async () => {
    let pending: { id: string; payload: PendingChatPayload }[] = [];
    try {
      pending = await getPendingMessages(chatId);
    } catch {
      return;
    }
    if (!pending.length) return;
    for (const item of pending) {
      try {
        const res = await chatService.sendMessage(chatId, item.payload);
        appendMessage(res.message);
        onNewMessage?.(res.message);
        await removePendingMessage(item.id);
      } catch {
        break;
      }
    }
    await refreshPendingCount();
  };

  const queueFailedPayload = async (payload: PendingChatPayload) => {
    const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    try {
      await savePendingMessage({ id: `${chatId}:${localId}`, chatId, payload, createdAt: Date.now() });
      setComposerError('No internet — message saved and will sync automatically');
    } catch {
      setComposerError('Could not send message');
    }
    await refreshPendingCount();
  };

  // Resend queued messages when the thread opens and whenever connectivity returns.
  useEffect(() => {
    if (!chatId) return;
    const timer = setTimeout(syncPending, 0);
    const onOnline = () => syncPending();
    window.addEventListener('online', onOnline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', onOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const sendText = async () => {
    const content = input.trim();
    if (!content || sending || uploading) return;
    setSending(true);
    setComposerError('');
    try {
      const res = await chatService.sendMessage(chatId, { content });
      appendMessage(res.message);
      onNewMessage?.(res.message);
      setInput('');
      requestAnimationFrame(resizeTextarea);
    } catch (error) {
      if (isNetworkError(error)) {
        await queueFailedPayload({ content });
      } else {
        setComposerError('Could not send message');
      }
    } finally {
      setSending(false);
    }
  };

  const startEditing = (message: ChatMessage) => {
    setMenuFor(null);
    setEditingMsg(message);
    setEditDraft(message.content ?? '');
    setComposerError('');
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const cancelEdit = () => {
    setEditingMsg(null);
    setEditDraft('');
  };

  const saveEdit = async () => {
    const content = editDraft.trim();
    if (!editingMsg || !content || sending) return;
    setSending(true);
    setComposerError('');
    try {
      const res = await chatService.editMessage(chatId, editingMsg._id, content);
      const updated = res.message ?? { ...editingMsg, content, edited: true };
      setMessages((prev) => prev.map((m) => (m._id === editingMsg._id ? updated : m)));
      // Replicate to the open conversation list previews.
      onNewMessage?.(updated);
      cancelEdit();
    } catch {
      setComposerError('Could not edit message');
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (message: ChatMessage, mode: 'me' | 'general') => {
    setMenuFor(null);
    if (mode === 'me') {
      try {
        await chatService.deleteMessage(chatId, message._id, 'me');
        setMessages((prev) => prev.filter((m) => m._id !== message._id));
      } catch {
        setComposerError('Could not delete message');
      }
      return;
    }
    // Delete for everyone — the server broadcasts message-deleted.
    try {
      await chatService.deleteMessage(chatId, message._id, 'general');
      setMessages((prev) => prev.map((m) =>
        m._id === message._id
          ? { ...m, isDeleted: true, content: null, attachmentData: null, attachmentUrl: null, attachmentType: null, edited: false }
          : m
      ));
    } catch {
      setComposerError('Could not delete message');
    }
  };

  // Send an image: downscale/compress, read as a base64 data URL and store
  // directly in MongoDB (server caps at 10 MB), matching the base64 pattern
  // used for voice notes.
  const uploadAndSend = async (file: Blob) => {
    if (sending || uploading) return;
    setUploading(true);
    setComposerError('');
    let dataUrl = '';
    try {
      dataUrl = await compressImageToDataUrl(file);
      const sent = await chatService.sendMessage(chatId, {
        attachmentData: dataUrl,
        attachmentType: 'image',
      });
      appendMessage(sent.message);
      onNewMessage?.(sent.message);
    } catch (error) {
      if (isNetworkError(error)) {
        await queueFailedPayload({ attachmentData: dataUrl, attachmentType: 'image' });
      } else {
        setComposerError('Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  // Send any file type: images are compressed, everything else is sent as a
  // base64 data URL with its original filename (stored directly in MongoDB).
  const sendAnyFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      uploadAndSend(file);
      return;
    }
    if (sending || uploading) return;
    if (file.size > 100 * 1024 * 1024) {
      setComposerError('File is too large (max 100 MB)');
      return;
    }
    setUploading(true);
    setComposerError('');
    let dataUrl = '';
    try {
      dataUrl = await fileToDataUrl(file);
      const sent = await chatService.sendMessage(chatId, {
        attachmentData: dataUrl,
        attachmentType: 'file',
        attachmentName: file.name,
      });
      appendMessage(sent.message);
      onNewMessage?.(sent.message);
    } catch (error) {
      if (isNetworkError(error)) {
        await queueFailedPayload({ attachmentData: dataUrl, attachmentType: 'file', attachmentName: file.name });
      } else {
        setComposerError('Upload failed');
      }
    } finally {
      setUploading(false);
    }
  };

  // Send a voice note as a base64 data URL — stored directly in MongoDB.
  const sendVoiceBlob = async (blob: Blob) => {
    if (sending || uploading) return;
    setUploading(true);
    setComposerError('');
    let dataUrl = '';
    try {
      dataUrl = await fileToDataUrl(blob);
      const sent = await chatService.sendVoiceNote(chatId, dataUrl);
      appendMessage(sent.message);
      onNewMessage?.(sent.message);
    } catch (error) {
      if (isNetworkError(error)) {
        await queueFailedPayload({ attachmentData: dataUrl, attachmentType: 'voice' });
      } else {
        setComposerError('Could not send voice note');
      }
    } finally {
      setUploading(false);
    }
  };

  // Paste an image from the clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    if (editingMsg) return;
    const items = Array.from(e.clipboardData?.items ?? []);
    const imageItem = items.find((item) => item.type.startsWith('image/'));
    const file = imageItem?.getAsFile();
    if (!file) return;
    e.preventDefault();
    uploadAndSend(file);
  };

  // Attach a file via the picker — any file type is accepted.
  const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    sendAnyFile(file);
  };

  // Voice notes via MediaRecorder — capped at 5 minutes, auto-sent at the cap.
  const fileToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

  const VOICE_MAX_MS = 5 * 60 * 1000; // 5 minutes

  const toggleRecording = async () => {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }

    setComposerError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      // Compress a little (lower bitrate) so the base64 payload stays close to
      // the original audio size despite base64's ~33% overhead.
      const recorder = new MediaRecorder(stream, {
        audioBitsPerSecond: 32000,
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      // Auto-stop at the 5-minute cap — the voice note is sent automatically.
      const autoStopTimer = setTimeout(() => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop();
        }
      }, VOICE_MAX_MS);

      recorder.onstop = () => {
        clearTimeout(autoStopTimer);
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        sendVoiceBlob(blob);
      };

      recorder.onerror = () => {
        clearTimeout(autoStopTimer);
        stream.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setComposerError('Could not record voice note');
      };

      recorder.start();
      setRecording(true);
    } catch {
      setComposerError('Microphone access was denied');
    }
  };

  const bubbleBase = mySenderType === 'instructor'
    ? 'bg-blue-600 text-white'
    : 'bg-amber-500 text-white';

  const otherBubble = isDark
    ? 'bg-slate-700 text-white'
    : 'bg-white text-gray-900 border border-gray-100';

  const inputBase = isDark
    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
    : 'bg-white border-slate-200 text-[#111827] placeholder-gray-400';

  return (
    <>
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        {participant?.profilePicture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={participant.profilePicture} alt={participant.name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
            {(participant?.name ?? '?').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
          </div>
        )}
        <div className="min-w-0">
          <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{participant?.name ?? 'Chat'}</p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>Mentorship program chat</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="grow overflow-y-auto no-scrollbar px-5 py-4 space-y-3 min-h-0">
        {loading && (
          <div className="flex flex-col gap-3 py-2" aria-busy="true" aria-label="Loading messages">
            {[60, 40, 75, 50, 80].map((w, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`h-10 rounded-2xl animate-pulse ${i % 2 === 0 ? (isDark ? 'bg-slate-700' : 'bg-gray-300') : (isDark ? 'bg-slate-600' : 'bg-gray-200')}`}
                  style={{ width: `${w}%` }}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className={`flex items-center justify-center h-full text-sm text-center ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
            <p>No messages yet — start the conversation!</p>
          </div>
        )}

        {messages.map((message) => {
          const mine = message.senderType === mySenderType;
          const deleted = message.isDeleted;
          const menuOpen = menuFor === message._id;
          return (
            <div key={message._id} className={`flex items-start gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
              {!mine && (participant?.profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={participant.profilePicture} alt={participant.name} className="w-7 h-7 rounded-full object-cover mt-1 shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs mt-1 shrink-0">
                  {(participant?.name ?? '?').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                </div>
              ))}
              <div className={`relative group max-w-[400px] rounded-2xl px-4 py-2.5 shadow-sm ${mine ? bubbleBase : otherBubble}`}>
                {deleted ? (
                  <p className={`text-sm italic ${mine ? 'text-white/70' : isDark ? 'text-slate-400' : 'text-gray-400'}`}>
                    This message was deleted
                  </p>
                ) : (
                  <>
                    {message.attachmentType === 'image' && (
                      message.attachmentData
                        ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={message.attachmentData} alt="attachment" className="rounded-xl max-h-60 max-w-full w-auto object-cover mb-1.5" />
                        )
                        : message.attachmentUrl
                          ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={resolveAssetUrl(message.attachmentUrl)} alt="attachment" className="rounded-xl max-h-60 max-w-full w-auto object-cover mb-1.5" />
                          )
                          : null
                    )}
                    {message.attachmentType === 'voice' && (
                      message.attachmentData
                        ? <audio controls src={message.attachmentData} className="h-9 max-w-[220px]" />
                        : message.attachmentUrl
                          ? <audio controls src={resolveAssetUrl(message.attachmentUrl)} className="h-9 max-w-[220px]" />
                          : null
                    )}
                    {message.attachmentType === 'file' && (
                      <a href={message.attachmentData || resolveAssetUrl(message.attachmentUrl) || '#'} download={message.attachmentName || 'attachment'}
                        className={`flex items-center gap-2 mb-1.5 rounded-lg border px-3 py-2 ${mine ? 'border-white/30 hover:bg-white/10' : isDark ? 'border-slate-400 hover:bg-black/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <FiFile size={20} className="shrink-0" />
                        <span className="text-xs font-semibold break-all">{message.attachmentName || 'Document'}</span>
                      </a>
                    )}
                    {message.content && (
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    )}
                  </>
                )}

                <div className={`flex items-center gap-1.5 ${mine ? 'justify-end' : 'justify-start'}`}>
                  <p className={`text-[10px] mt-1 opacity-70 ${mine ? 'text-white/80' : ''}`}>
                    {timeLabel(message.createdAt)}
                    {message.edited && !deleted && <span className="ml-1 italic">(edited)</span>}
                  </p>

                  {!deleted && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuFor(menuOpen ? null : message._id)}
                        className={`text-[10px] opacity-0 group-hover:opacity-80 transition-opacity cursor-pointer p-0.5 rounded hover:opacity-100 ${mine ? 'text-white' : isDark ? 'text-slate-300' : 'text-gray-500'}`}
                        title="Message options"
                      >
                        <FiMoreVertical size={14} />
                      </button>
                      {menuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                          <div className={`absolute right-0 ${mine ? 'bottom-full mb-1' : 'left-full ml-1 top-1/2 -translate-y-1/2'} z-20 w-44 rounded-xl shadow-lg border py-1 text-sm ${isDark ? 'bg-slate-800 border-slate-600 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                            {mine && (
                              <button type="button" onClick={() => startEditing(message)}
                                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-black/5 cursor-pointer">
                                <FiEdit size={14} /> Edit message
                              </button>
                            )}
                            <button type="button" onClick={() => deleteMessage(message, 'me')}
                              className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-black/5 cursor-pointer">
                              <FiTrash2 size={14} /> Delete for me
                            </button>
                            <button type="button" onClick={() => deleteMessage(message, 'general')}
                              className="w-full text-left px-3 py-2 flex items-center gap-2 text-red-500 hover:bg-red-50 cursor-pointer">
                              <FiTrash2 size={14} /> Delete for everyone
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {mine && (authUser?.profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={authUser.profilePicture} alt={authUser?.name ?? 'You'} className="w-7 h-7 rounded-full object-cover mt-1 shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs mt-1 shrink-0">
                  {(authUser?.name ?? 'You').split(' ').slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')}
                </div>
              ))}
            </div>
          );
        })}

        {uploading && (
          <div className="flex justify-end">
            <div className={`rounded-2xl px-4 py-3 flex items-center gap-2 ${isDark ? 'bg-slate-700' : 'bg-white border border-gray-100'}`}>
              <FiLoader className="animate-spin text-blue-500" size={16} />
              <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>Uploading attachment…</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className={`px-4 py-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
        {composerError && (
          <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
            <FiX size={13} /> {composerError}
          </p>
        )}

        {recording && (
          <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Recording… tap the mic to stop
          </p>
        )}

        {pendingCount > 0 && (
          <div className={`flex items-center justify-between rounded-2xl border px-4 py-2 mb-2 ${isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
            <p className={`text-xs font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              {pendingCount} message{pendingCount === 1 ? '' : 's'} not sent yet — will send when back online
            </p>
            <button type="button" onClick={syncPending}
              className={`text-xs font-semibold flex items-center gap-1 cursor-pointer hover:underline ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
              <FiRefreshCw size={12} /> Sync now
            </button>
          </div>
        )}

        {editingMsg && (
          <div className={`flex items-center justify-between rounded-2xl border px-4 py-2 mb-2 ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-blue-50 border-blue-100'}`}>
            <p className="text-xs text-blue-600 font-medium">Editing message</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={cancelEdit}
                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={!editDraft.trim() || sending}
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                <FiCheck size={13} /> Save
              </button>
            </div>
          </div>
        )}

        <div className={`flex items-end gap-2 rounded-2xl border px-3 py-2 ${inputBase}`}>
          {!editingMsg && (
            <label className={`shrink-0 p-2 rounded-full cursor-pointer transition-colors ${isDark ? 'text-slate-200 hover:text-blue-400 hover:bg-white/10' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-500/10'}`} title="Attach a file">
              <FiPaperclip size={18} />
              <input type="file" className="hidden" onChange={handleAttach} />
            </label>
          )}

          <textarea
            ref={textareaRef}
            value={editingMsg ? editDraft : input}
            onChange={(e) => {
              if (editingMsg) setEditDraft(e.target.value);
              else setInput(e.target.value);
              resizeTextarea();
            }}
            onPaste={handlePaste}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (editingMsg) saveEdit();
                else sendText();
              }
            }}
            rows={1}
            placeholder={editingMsg ? 'Edit your message…' : 'Type a message… (paste an image to share it)'}
            className={`grow resize-none bg-transparent focus:outline-none text-sm py-1 overflow-hidden ${isDark ? 'text-white placeholder-slate-400' : 'text-[#111827] placeholder-gray-400'}`}
          />

          <button type="button" onClick={editingMsg ? cancelEdit : toggleRecording} title={editingMsg ? 'Cancel edit' : 'Record voice note'}
            className={`shrink-0 p-2 rounded-full transition-colors cursor-pointer ${recording ? 'bg-red-500 text-white animate-pulse' : isDark ? 'text-slate-200 hover:text-red-500 hover:bg-white/10' : 'text-gray-600 hover:text-red-500 hover:bg-red-500/10'}`}>
            <FiMic size={18} />
          </button>

          <button type="button" onClick={editingMsg ? saveEdit : sendText}
            disabled={editingMsg
              ? (!editDraft.trim() || sending)
              : (!input.trim() || sending || uploading)}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center">
            {sending ? <FiLoader className="animate-spin" size={18} /> : editingMsg ? <FiCheck size={18} /> : <FiSend size={18} />}
          </button>
        </div>
      </div>
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