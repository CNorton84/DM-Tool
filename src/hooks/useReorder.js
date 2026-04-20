import { useCallback } from 'react';

export const useReorder = () => {
  const reorder = useCallback((list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }, []);

  return reorder;
};