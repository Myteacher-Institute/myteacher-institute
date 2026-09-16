// Offline message queue — a tiny IndexedDB store that holds messages that
// failed to send (network interruption) so they can be re-sent automatically
// once connectivity is restored. Kept intentionally simple: one object store
// keyed by a local id.

const DB_NAME = 'myteacher-chat';
const STORE = 'pending';

export interface PendingChatPayload {
  content?: string;
  attachmentData?: string;
  attachmentType?: 'image' | 'voice' | 'file';
  attachmentName?: string;
}

export interface PendingChatMessage {
  id: string;
  chatId: string;
  payload: PendingChatPayload;
  createdAt: number;
}

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
  });

export const savePendingMessage = async (message: PendingChatMessage): Promise<void> => {
  if (typeof indexedDB === 'undefined') return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(message);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getPendingMessages = async (chatId: string): Promise<PendingChatMessage[]> => {
  if (typeof indexedDB === 'undefined') return [];
  const db = await openDb();
  return new Promise((resolve) => {
    const results: PendingChatMessage[] = [];
    const tx = db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        if (cursor.value.chatId === chatId) results.push(cursor.value);
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => resolve([]);
  });
};

export const removePendingMessage = async (id: string): Promise<void> => {
  if (typeof indexedDB === 'undefined') return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};