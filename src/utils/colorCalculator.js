export const COLORS = {
  black: '#0a0a0a',
  gray: '#1a1a1a',
  bronze: '#cd7f32',
  white: '#e0e0e0',
  red: '#ef4444',
  green: '#22c55e',
};

export const getDieColor = (value, sides) => {
  if (value === 1) return COLORS.red;
  if (value === sides) return COLORS.green;
  return null;
};

export const getTotalColor = (total, minPossible, maxPossible) => {
  if (total <= minPossible) return COLORS.red;
  if (total >= maxPossible) return COLORS.green;
  return null;
};
