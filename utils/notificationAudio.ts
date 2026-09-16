// Notification audio and vibration utilities

interface NotificationSound {
  type: 'success' | 'error' | 'info' | 'warning';
  frequency: number;
  duration: number;
}

const SOUNDS: Record<string, NotificationSound> = {
  success: { type: 'success', frequency: 800, duration: 200 },
  error: { type: 'error', frequency: 300, duration: 300 },
  info: { type: 'info', frequency: 600, duration: 200 },
  warning: { type: 'warning', frequency: 500, duration: 250 }
};

let audioContext: AudioContext | null = null;
let notificationAudio: HTMLAudioElement | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const getNotificationAudio = (): HTMLAudioElement | null => {
  if (typeof window === 'undefined') return null;
  if (!notificationAudio) {
    notificationAudio = new Audio('/notification.mp3');
    notificationAudio.preload = 'auto';
  }
  return notificationAudio;
};

export const playNotificationSound = (type: 'success' | 'error' | 'info' | 'warning' = 'info'): void => {
  try {
    if (typeof window === 'undefined') return;

    // Check if sound is enabled in user preferences
    const soundEnabled = localStorage.getItem('notificationSoundEnabled') !== 'false';
    if (!soundEnabled) return;

    const audio = getNotificationAudio();
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fall back to the WebAudio beep if the mp3 cannot be played
          playTone(type);
        });
      }
      return;
    }

    playTone(type);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

const playTone = (type: 'success' | 'error' | 'info' | 'warning'): void => {
  try {
    if (typeof window === 'undefined') return;

    const sound = SOUNDS[type] || SOUNDS.info;
    const context = getAudioContext();

    // Resume context if suspended (required by some browsers)
    if (context.state === 'suspended') {
      context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = sound.frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + sound.duration / 1000);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + sound.duration / 1000);
  } catch (error) {
    console.error('Error playing fallback tone:', error);
  }
};

export const vibrateDevice = (pattern: number | number[] = [200]): void => {
  try {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

    // Check if vibration is enabled in user preferences
    const vibrationEnabled = localStorage.getItem('notificationVibrationEnabled') !== 'false';
    if (!vibrationEnabled) return;

    navigator.vibrate(pattern);
  } catch (error) {
    console.error('Error vibrating device:', error);
  }
};

export const triggerNotificationFeedback = (type: 'success' | 'error' | 'info' | 'warning' = 'info'): void => {
  playNotificationSound(type);
  vibrateDevice([100, 50, 100]);
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('notificationSoundEnabled', enabled.toString());
  }
};

export const setVibrationEnabled = (enabled: boolean): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('notificationVibrationEnabled', enabled.toString());
  }
};

export const isSoundEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('notificationSoundEnabled') !== 'false';
};

export const isVibrationEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('notificationVibrationEnabled') !== 'false';
};

export const requestAudioPermission = async (): Promise<boolean> => {
  try {
    if (typeof window === 'undefined') return false;

    const context = getAudioContext();
    
    if (context.state === 'suspended') {
      await context.resume();
    }

    return true;
  } catch (error) {
    console.error('Error requesting audio permission:', error);
    return false;
  }
};
