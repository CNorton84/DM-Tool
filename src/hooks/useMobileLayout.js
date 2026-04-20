import { useState, useCallback, useEffect, useRef } from 'react';

const BREAKPOINTS = {
  DESKTOP: 1024,
  TABLET: 768,
};

const NARROW_ASPECT_RATIO = 0.65;
const SWIPE_THRESHOLD = 50;

export function useMobileLayout() {
  const [mode, setMode] = useState('desktop');
  const [activePanel, setActivePanel] = useState('savedRolls');
  const touchStartRef = useRef(null);
  const isSwipeGestureRef = useRef(false);

  const checkMode = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const isNarrow = aspectRatio < NARROW_ASPECT_RATIO;

    if (width >= BREAKPOINTS.DESKTOP && !isNarrow) {
      setMode('desktop');
    } else if (width >= BREAKPOINTS.TABLET || !isNarrow) {
      setMode('tablet');
    } else {
      setMode('mobile');
    }
  }, []);

  const mobilePanels = ['savedRolls', 'dice', 'combatants'];

  const handleTouchStart = useCallback((e) => {
    const target = e.target;
    // Check if touch started on a drag handle (has touch-action-none class)
    // Only touches on the drag handle should be blocked from swipe detection
    const isDragHandle = target.closest('.touch-action-none');
    if (isDragHandle) {
      // This is a drag gesture - don't track for swipe
      isSwipeGestureRef.current = false;
      return;
    }
    // This is a swipe gesture (touching anywhere else on the card or outside)
    isSwipeGestureRef.current = true;
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    // Only process swipe if this was a swipe gesture (not a drag)
    if (!isSwipeGestureRef.current) {
      touchStartRef.current = null;
      return;
    }

    if (touchStartRef.current === null) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        // Swipe left: next panel
        const currentIndex = mobilePanels.indexOf(activePanel);
        const nextIndex = (currentIndex + 1) % mobilePanels.length;
        setActivePanel(mobilePanels[nextIndex]);
      } else {
        // Swipe right: previous panel
        const currentIndex = mobilePanels.indexOf(activePanel);
        const prevIndex = (currentIndex - 1 + mobilePanels.length) % mobilePanels.length;
        setActivePanel(mobilePanels[prevIndex]);
      }
    }
    
    touchStartRef.current = null;
    isSwipeGestureRef.current = false;
  }, [activePanel]);

  useEffect(() => {
    checkMode();
    window.addEventListener('resize', checkMode);
    window.addEventListener('orientationchange', checkMode);
    return () => {
      window.removeEventListener('resize', checkMode);
      window.removeEventListener('orientationchange', checkMode);
    };
  }, [checkMode]);

  return {
    mode,
    activePanel,
    setActivePanel,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
  };
}