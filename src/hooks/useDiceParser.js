import { useState, useCallback } from 'react';
import { parseDiceCommand, rollDice } from '../utils/diceParser';
import { getErrorMessage } from '../utils/validators';

export const useDiceParser = () => {
  const [lastError, setLastError] = useState(null);

  const roll = useCallback((command) => {
    const error = getErrorMessage(command);
    if (error) {
      setLastError(error);
      console.error(error);
      return null;
    }

    const parsed = parseDiceCommand(command);
    if (!parsed) {
      setLastError('Failed to parse command');
      console.error('Failed to parse command:', command);
      return null;
    }

    setLastError(null);
    const result = rollDice(parsed);
    result.formula = parsed.formula;
    result.command = command;
    result.timestamp = Date.now();
    result.id = `roll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return result;
  }, []);

  return { roll, lastError };
};