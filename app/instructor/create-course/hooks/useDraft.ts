import { useEffect } from 'react';
import { DRAFT_KEY } from '../constants';

const stripFiles = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripFiles);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === 'file') continue;
      out[k] = stripFiles(v);
    }
    return out;
  }
  return value;
};

export const saveDraft = (data: unknown) => {
  try {
    const draftString = JSON.stringify(stripFiles(data));
    sessionStorage.setItem(DRAFT_KEY, draftString);
    localStorage.setItem(DRAFT_KEY, draftString);
  } catch {}
};

export const loadDraft = () => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY) || sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const clearDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
};

export const useDraft = <T,>(data: T) => {
  useEffect(() => {
    saveDraft(data);
  }, [data]);
};
