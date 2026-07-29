import { useEffect } from 'react';
import { DRAFT_KEY } from '../constants';

export const saveDraft = (data: object) => {
  try {
    const draftString = JSON.stringify(data);
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

export const useDraft = (data: any) => {
  useEffect(() => {
    saveDraft(data);
  }, [data]);
};
