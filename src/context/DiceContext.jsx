import { createContext, useContext, useState, useCallback } from 'react';
import { parseDiceCommand, rollDice } from '../utils/diceParser';
import { getErrorMessage } from '../utils/validators';

const DiceContext = createContext(null);

export const useDiceContext = () => {
  const context = useContext(DiceContext);
  if (!context) {
    throw new Error('useDiceContext must be used within DiceProvider');
  }
  return context;
};

export const DiceProvider = ({ children }) => {
  const [rollHistory, setRollHistory] = useState([]);
  const [savedRolls, setSavedRolls] = useState(() => {
    const saved = localStorage.getItem('dm-app-saved-rolls');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = useCallback((roll) => {
    setRollHistory((prev) => {
      const newHistory = [roll, ...prev];
      if (newHistory.length > 50) {
        newHistory.splice(50);
      }
      return newHistory;
    });
  }, []);

  const handleRoll = useCallback((command) => {
    // Basic validation
    const error = getErrorMessage(command);
    if (error) {
      return { error: { message: error, code: 'VALIDATION_ERROR', position: 0, input: command } };
    }

    // Parse command
    const parsed = parseDiceCommand(command);
    if (!parsed.valid) {
      return { error: { ...parsed.error, input: command } };
    }

    // Roll dice
    const result = rollDice(parsed.parts);
    result.formula = parsed.formula;
    result.command = command;
    result.parts = parsed.parts;
    result.timestamp = Date.now();
    result.id = `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    addToHistory(result);
    return result;
  }, [addToHistory]);

  const saveRoll = useCallback((roll) => {
    const savedCommand = {
      id: roll.id,
      command: roll.command || roll.formula,
      label: roll.label || roll.command || roll.formula,
      createdAt: Date.now(),
    };
    setSavedRolls((prev) => {
      const newSaved = [savedCommand, ...prev];
      if (newSaved.length > 50) {
        newSaved.splice(50);
      }
      localStorage.setItem('dm-app-saved-rolls', JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  const updateSavedRoll = useCallback((id, updates) => {
    setSavedRolls((prev) => {
      const updated = prev.map((roll) =>
        roll.id === id ? { ...roll, ...updates } : roll
      );
      localStorage.setItem('dm-app-saved-rolls', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeSavedRoll = useCallback((id) => {
    setSavedRolls((prev) => {
      const filtered = prev.filter((roll) => roll.id !== id);
      localStorage.setItem('dm-app-saved-rolls', JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setRollHistory([]);
  }, []);

  // Combatant state - loaded from localStorage
  const [combatants, setCombatants] = useState(() => {
    const saved = localStorage.getItem('dm-app-combatants');
    return saved ? JSON.parse(saved) : [];
  });

  const addCombatant = useCallback((combatantData) => {
    setCombatants((prev) => {
      const newCombatant = {
        id: `combatant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: combatantData.name || 'Unnamed Combatant',
        totalHp: combatantData.totalHp || 0,
        currentHp: combatantData.currentHp || combatantData.totalHp || 0,
        description: combatantData.description || '',
        createdAt: Date.now(),
      };
      const newCombatants = [newCombatant, ...prev];
      if (newCombatants.length > 20) {
        newCombatants.splice(20);
      }
      localStorage.setItem('dm-app-combatants', JSON.stringify(newCombatants));
      return newCombatants;
    });
  }, []);

  const removeCombatant = useCallback((id) => {
    setCombatants((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      localStorage.setItem('dm-app-combatants', JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  const updateCombatant = useCallback((id, updates) => {
    setCombatants((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      localStorage.setItem('dm-app-combatants', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const duplicateCombatant = useCallback((id) => {
    setCombatants((prev) => {
      const combatantToDuplicate = prev.find((c) => c.id === id);
      if (!combatantToDuplicate) return prev;
      const newCombatant = {
        ...combatantToDuplicate,
        id: `combatant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${combatantToDuplicate.name} (Copy)`,
        createdAt: Date.now(),
      };
      const newCombatants = [newCombatant, ...prev];
      if (newCombatants.length > 20) {
        newCombatants.splice(20);
      }
      localStorage.setItem('dm-app-combatants', JSON.stringify(newCombatants));
      return newCombatants;
    });
  }, []);

  const applyDamage = useCallback((id, amount) => {
    setCombatants((prev) => {
      return prev.map((c) => {
        if (c.id !== id) return c;
        const newCurrentHp = Math.max(0, c.currentHp + amount);
        return { ...c, currentHp: newCurrentHp };
      });
    });
  }, []);

  const value = {
    rollHistory,
    savedRolls,
    combatants,
    handleRoll,
    saveRoll,
    updateSavedRoll,
    removeSavedRoll,
    clearHistory,
    addCombatant,
    removeCombatant,
    updateCombatant,
    duplicateCombatant,
    applyDamage,
  };

  return (
    <DiceContext.Provider value={value}>
      {children}
    </DiceContext.Provider>
  );
};
