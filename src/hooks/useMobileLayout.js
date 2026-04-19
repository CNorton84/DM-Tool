import { useState, useCallback, useEffect } from 'react';

const BREAKPOINTS = {
  DESKTOP: 1024,
  TABLET: 768,
};

const NARROW_ASPECT_RATIO = 0.65;

export function useMobileLayout() {
  const [mode, setMode] = useState('desktop');
  const [activePanel, setActivePanel] = useState('savedRolls');

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

  useEffect(() => {
    checkMode();
    window.addEventListener('resize', checkMode);
    window.addEventListener('orientationchange', checkMode);
    return () => {
      window.removeEventListener('resize', checkMode);
      window.removeEventListener('orientationchange', checkMode);
    };
  }, [checkMode]);

  return { mode, activePanel, setActivePanel };
}