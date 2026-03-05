import { useState, useCallback, useEffect } from 'react';

export const useSavedRolls = (maxRolls = 50) => {
  const [savedRolls, setSavedRolls] = useState(() => {
    try {
      const saved = localStorage.getItem('dm-app-saved-rolls');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('dm-app-saved-rolls', JSON.stringify(savedRolls));
  }, [savedRolls]);

  const addSavedRoll = useCallback((roll) => {
    setSavedRolls((prev) => {
      const newSaved = [roll, ...prev];
      if (newSaved.length > maxRolls) {
        newSaved.splice(maxRolls);
      }
      return newSaved;
    });
  }, [maxRolls]);

  const updateSavedRoll = useCallback((id, updates) => {
    setSavedRolls((prev) =>
      prev.map((roll) => (roll.id === id ? { ...roll, ...updates } : roll))
    );
  }, []);

  const removeSavedRoll = useCallback((id) => {
    setSavedRolls((prev) => prev.filter((roll) => roll.id !== id));
  }, []);

  return {
    savedRolls,
    addSavedRoll,
    updateSavedRoll,
    removeSavedRoll,
  };
};