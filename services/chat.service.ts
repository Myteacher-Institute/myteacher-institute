// Chat Service — mentorship conversations (instructor <> student)
import axiosInstance from '../lib/axios';
import { API_CONFIG } from '../config/api';

/**
 * The chat backend returns relative asset paths like `/uploads/assets/<file>`.
 * Prefix them with the API base URL so `<img>` / `<audio>` resolve to the
 * backend server (which statically serves /uploads) instead of the Next.js
 * origin where they 404.
 */
export const resolveAssetUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/') ) {
    return `${API_CONFIG.baseURL}${url}`;
  }
  return url;
};

export interface ChatParticipant {
  _id: string;
  name: string;
  profilePicture?: string;
  email?: string;
  specialization?: string;
  mentorshipPrice?: number;
}

export interface ChatLastMessage {
  _id: string;
  content: string | null;
  attachmentType: 'image' | 'voice' | 'file' | null;
  senderId: string;
  senderType: 'user' | 'instructor';
  createdAt: string;
}

export interface ChatConversation {
  chatId: string;
  mentorshipId: string;
  participant: ChatParticipant;
  lastMessageAt: string | null;
  lastMessage: ChatLastMessage | null;
  unreadCount: number;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  senderType: 'user' | 'instructor';
  content: string | null;
  attachmentUrl: string | null;
  attachmentData: string | null;
  attachmentType: 'image' | 'voice' | 'file' | null;
  attachmentName?: string | null;
  createdAt: string;
  readBy: string[];
  edited?: boolean;
  isDeleted?: boolean;
  deletedForMe?: boolean;
}

export interface ChatThread {
  chatId: string;
  mentorshipId: string;
  studentId: string;
  instructorId: string;
  messages: ChatMessage[];
}

const fileToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

// Downscale + re-encode an image to a compact JPEG data URL before upload
export const compressImageToDataUrl = async (file: File | Blob, maxDim = 1280, quality = 0.72): Promise<string> => {
  const rawDataUrl = await fileToDataUrl(file);

  if (typeof window === 'undefined') return rawDataUrl;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not read image'));
    image.src = rawDataUrl;
  });

  // Small images are returned as-is (re-encoding only when it helps size)
  if (img.width <= maxDim && img.height <= maxDim) {
    return rawDataUrl;
  }

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) return rawDataUrl;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
};

export const chatService = {
  // Resolve (or lazily create) the conversation for a specific mentorship
  async resolveChat(mentorshipId: string): Promise<{ status: string; chat: { chatId: string; mentorshipId: string } }> {
    const res = await axiosInstance.get(`/api/chat/mentorship/${mentorshipId}`);
    return res.data;
  },

  // Instructor's conversations
  async getInstructorChats(): Promise<{ status: string; chats: ChatConversation[] }> {
    const res = await axiosInstance.get('/api/chat/instructor');
    return res.data;
  },

  // Student's conversations
  async getStudentChats(): Promise<{ status: string; chats: ChatConversation[] }> {
    const res = await axiosInstance.get('/api/chat/student');
    return res.data;
  },

  // Full conversation (also marks the other party's messages as read)
  async getMessages(chatId: string): Promise<ChatThread> {
    const res = await axiosInstance.get(`/api/chat/${chatId}/messages`);
    return res.data;
  },

  // A single message, including base64 attachmentData (Pusher events strip it
  // to stay under the payload cap, so clients fetch it on demand).
  async getMessage(chatId: string, messageId: string): Promise<{ status: string; message: ChatMessage }> {
    const res = await axiosInstance.get(`/api/chat/${chatId}/messages/${messageId}`);
    return res.data;
  },

  // Edit a message's text (only the original sender)
  async editMessage(
    chatId: string,
    messageId: string,
    content: string
  ): Promise<{ status: string; message: ChatMessage }> {
    const res = await axiosInstance.patch(`/api/chat/${chatId}/messages/${messageId}`, { content });
    return res.data;
  },

  // Delete a message: mode "me" (hide for me) or "general" (hide for everyone)
  async deleteMessage(
    chatId: string,
    messageId: string,
    mode: 'me' | 'general' = 'me'
  ): Promise<{ status: string; mode: 'me' | 'general' }> {
    const res = await axiosInstance.delete(`/api/chat/${chatId}/messages/${messageId}`, {
      params: { mode },
    });
    return res.data;
  },

  // Send a text message or an image (as base64 attachmentData, or legacy
  // attachmentUrl for images previously stored on the filesystem)
  async sendMessage(
    chatId: string,
    data: {
      content?: string;
      attachmentUrl?: string;
      attachmentData?: string;
      attachmentType?: 'image' | 'voice' | 'file';
      attachmentName?: string;
    }
  ): Promise<{ status: string; message: ChatMessage }> {
    const res = await axiosInstance.post(`/api/chat/${chatId}/messages`, data);
    return res.data;
  },

  // Send a voice note as a base64 data URL — stored directly in MongoDB,
  // capped server-side at ~5 minutes.
  async sendVoiceNote(
    chatId: string,
    dataUrl: string
  ): Promise<{ status: string; message: ChatMessage }> {
    const res = await axiosInstance.post(`/api/chat/${chatId}/messages`, {
      attachmentData: dataUrl,
      attachmentType: 'voice',
    });
    return res.data;
  },

  // Compress/serialize a file on the client, then save it as base64 on the server.
  // Returns the URL to pass to sendMessage.
  async uploadAttachment(
    chatId: string,
    data: { kind: 'image' | 'voice'; file: Blob }
  ): Promise<{ status: string; attachment: { url: string; type: 'image' | 'voice' } }> {
    const dataUrl = data.kind === 'image'
      ? await compressImageToDataUrl(data.file)
      : await fileToDataUrl(data.file);

    const res = await axiosInstance.post(`/api/chat/${chatId}/attachments`, {
      dataUrl,
      kind: data.kind,
    });
    return res.data;
  },
};