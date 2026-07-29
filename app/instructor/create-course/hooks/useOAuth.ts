import { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/lib/axios';

export const useOAuth = () => {
  const [showYouTubeAuthModal, setShowYouTubeAuthModal] = useState(false);
  const [showDriveAuthModal, setShowDriveAuthModal] = useState(false);

  // Callback refs so consumers can react to successful auth from the popup
  const onYouTubeAuthSuccessRef = useRef<(() => void) | null>(null);
  const onDriveAuthSuccessRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'youtube-auth-success') {
        console.log('YouTube authentication successful');
        onYouTubeAuthSuccessRef.current?.();
        onYouTubeAuthSuccessRef.current = null;
      }
      if (event.data.type === 'drive-auth-success') {
        console.log('Google Drive authentication successful');
        onDriveAuthSuccessRef.current?.();
        onDriveAuthSuccessRef.current = null;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /**
   * Kick off YouTube OAuth flow.
   * Always uses ?force=true so the backend generates a fresh authUrl even when
   * tokens already exist — this covers the "re-authenticate" case.
   * @param onSuccess  Optional callback fired after the popup signals success.
   */
  const handleYouTubeAuth = async (onSuccess?: () => void) => {
    try {
      // force=true ensures we always get an authUrl back, even if tokens exist
      const res = await axiosInstance.get("/api/youtube/auth?force=true");
      if (res.data.status === "success" && res.data.authUrl) {
        (window as any).youtubeAuthUrl = res.data.authUrl;
        if (onSuccess) {
          onYouTubeAuthSuccessRef.current = onSuccess;
        }
        setShowYouTubeAuthModal(true);
      } else {
        alert("Failed to get YouTube authentication URL. Please try again.");
      }
    } catch (err: any) {
      console.error("YouTube auth error:", err);
      alert("Failed to initiate YouTube authentication. Please try again.");
    }
  };

  const confirmYouTubeAuth = (formData?: any) => {
    setShowYouTubeAuthModal(false);
    const authUrl = (window as any).youtubeAuthUrl;
    if (authUrl) {
      if (formData) {
        sessionStorage.setItem('course_form_state', JSON.stringify(formData));
        sessionStorage.setItem('course_form_redirect', 'true');
      }

      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(authUrl, 'youtube-auth', `width=${width},height=${height},left=${left},top=${top}`);
    }
  };

  const handleDriveAuth = async (onSuccess?: () => void) => {
    try {
      const res = await axiosInstance.get("/api/drive/auth?force=true");
      if (res.data.authUrl) {
        (window as any).driveAuthUrl = res.data.authUrl;
        if (onSuccess) {
          onDriveAuthSuccessRef.current = onSuccess;
        }
        setShowDriveAuthModal(true);
      } else if (res.data.authenticated) {
        // Already authenticated — fire the callback immediately
        onSuccess?.();
      } else {
        alert("Failed to get Google Drive authentication URL. Please try again.");
      }
    } catch (err: any) {
      console.error("Google Drive auth error:", err);
      alert("Failed to initiate Google Drive authentication. Please try again.");
    }
  };

  const confirmDriveAuth = (formData?: any) => {
    setShowDriveAuthModal(false);
    const authUrl = (window as any).driveAuthUrl;
    if (authUrl) {
      if (formData) {
        sessionStorage.setItem('course_form_state', JSON.stringify(formData));
        sessionStorage.setItem('course_form_redirect', 'true');
      }

      const width = 500;
      const height = 600;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(authUrl, 'drive-auth', `width=${width},height=${height},left=${left},top=${top}`);
    }
  };

  return {
    showYouTubeAuthModal,
    setShowYouTubeAuthModal,
    showDriveAuthModal,
    setShowDriveAuthModal,
    handleYouTubeAuth,
    confirmYouTubeAuth,
    handleDriveAuth,
    confirmDriveAuth
  };
};
