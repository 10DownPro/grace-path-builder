import { useState, useEffect, useCallback } from 'react';
import { useUserProgress } from './useUserProgress';

const FREE_CHAPTER_SHOWN_KEY = 'faith-training-free-chapter-shown';
const FREE_CHAPTER_DOWNLOADED_KEY = 'faith-training-free-chapter-downloaded';

export function useFreeChapter() {
  const { progress } = useUserProgress();
  const [shouldShowUnlock, setShouldShowUnlock] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    // Check if already shown
    const alreadyShown = localStorage.getItem(FREE_CHAPTER_SHOWN_KEY);
    const downloaded = localStorage.getItem(FREE_CHAPTER_DOWNLOADED_KEY);
    
    if (downloaded) {
      setHasDownloaded(true);
    }

    // Check if user has 7-day streak and hasn't seen the unlock dialog
    if (progress && progress.current_streak >= 7 && !alreadyShown) {
      setShouldShowUnlock(true);
    }
  }, [progress]);

  const markAsShown = useCallback(() => {
    localStorage.setItem(FREE_CHAPTER_SHOWN_KEY, 'true');
    setShouldShowUnlock(false);
  }, []);

  const downloadChapter = useCallback(() => {
    // Mark as downloaded
    localStorage.setItem(FREE_CHAPTER_DOWNLOADED_KEY, 'true');
    setHasDownloaded(true);
    
    // In production, this would trigger an actual PDF download
    // For now, show a success message
    // TODO: Replace with actual PDF URL
    const pdfUrl = '#'; // Placeholder - replace with actual Chapter 1 PDF URL
    
    if (pdfUrl !== '#') {
      window.open(pdfUrl, '_blank');
    }
    
    markAsShown();
  }, [markAsShown]);

  const closeDialog = useCallback(() => {
    markAsShown();
  }, [markAsShown]);

  return {
    shouldShowUnlock,
    hasDownloaded,
    downloadChapter,
    closeDialog,
  };
}
