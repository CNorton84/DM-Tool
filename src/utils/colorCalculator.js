export const COLORS = {
  red: '#ff0000',
  gray: '#808080',
  green: '#00ff00',
};

/**
 * Interpolates between two hex colors.
 * @param {string} color1 - Start hex color.
 * @param {string} color2 - End hex color.
 * @param {number} t - Interpolation factor (0 to 1).
 * @returns {string} Interpolated hex color.
 */
const interpolateColor = (color1, color2, t) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Gets a color for a single die roll using three-point interpolation:
 * red (min) -> gray (average) -> green (max).
 * @param {number} value - The rolled value.
 * @param {number} sides - Total number of sides on the die.
 * @returns {string} Hex color for the die face.
 */
export const getDieColor = (value, sides) => {
  const avg = Math.round((sides + 1) / 2);

  if (value === 1) return COLORS.red;
  if (value === sides) return COLORS.green;
  if (value === avg) return COLORS.gray;

  if (value < avg) {
    // Interpolate from red to gray
    const t = (value - 1) / (avg - 1);
    return interpolateColor(COLORS.red, COLORS.gray, Math.min(t, 1));
  } else {
    // Interpolate from gray to green
    const t = (value - avg) / (sides - avg);
    return interpolateColor(COLORS.gray, COLORS.green, Math.min(t, 1));
  }
};

/**
 * Gets a color for a total roll using three-point interpolation:
 * red (min) -> gray (average) -> green (max).
 * @param {number} total - The total roll result.
 * @param {number} minPossible - Minimum possible roll.
 * @param {number} maxPossible - Maximum possible roll.
 * @returns {string} Hex color for the total.
 */
export const getTotalColor = (total, minPossible, maxPossible) => {
  const avg = Math.round((minPossible + maxPossible) / 2);

  if (total <= minPossible) return COLORS.red;
  if (total >= maxPossible) return COLORS.green;
  if (total === avg) return COLORS.gray;

  if (total < avg) {
    // Interpolate from red to gray
    const t = (total - minPossible) / (avg - minPossible);
    return interpolateColor(COLORS.red, COLORS.gray, Math.min(t, 1));
  } else {
    // Interpolate from gray to green
    const t = (total - avg) / (maxPossible - avg);
    return interpolateColor(COLORS.gray, COLORS.green, Math.min(t, 1));
  }
};
