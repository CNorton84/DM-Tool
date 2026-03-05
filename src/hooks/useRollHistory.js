import { useState, useCallback } from 'react';

export const useRollHistory = (maxRolls = 50) => {
  const [history, setHistory] = useState([]);

  const addToHistory = useCallback((roll) => {
    setHistory((prev) => {
      const newHistory = [roll, ...prev];
      if (newHistory.length > maxRolls) {
        newHistory.splice(maxRolls);
      }
      return newHistory;
    });
  }, [maxRolls]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
};