import PropTypes from 'prop-types';
import { getDieColor } from '../../utils/colorCalculator';

export const RollResult = ({ result, onSave, onRollAgain }) => {
  const { total, dice, minPossible, maxPossible } = result;

  const getTotalColor = () => {
    const avg = Math.round((minPossible + maxPossible) / 2);
    
    let color;
    if (total <= minPossible) {
      color = { color: '#ff0000' };
    } else if (total >= maxPossible) {
      color = { color: '#00ff00' };
    } else if (total === avg) {
      color = { color: '#808080' };
    } else if (total < avg) {
      const t = (total - minPossible) / (avg - minPossible);
      const r = Math.round(255 + (128 - 255) * t);
      const g = Math.round(0 + (128 - 0) * t);
      const b = Math.round(0 + (128 - 0) * t);
      color = { color: `rgb(${r}, ${g}, ${b})` };
    } else {
      const t = (total - avg) / (maxPossible - avg);
      const r = Math.round(128 + (0 - 128) * t);
      const g = Math.round(128 + (255 - 128) * t);
      const b = Math.round(128 + (0 - 128) * t);
      color = { color: `rgb(${r}, ${g}, ${b})` };
    }
    return color;
  };

  const modifier = result.parts?.reduce((sum, p) => p.type === 'modifier' ? sum + p.value : sum, 0) || 0;
  const modifierDisplay = modifier !== 0 ? ` ${modifier > 0 ? '+ ' : '- '}${Math.abs(modifier)}` : '';
  const diceDisplay = dice.map((d, i) => (
    <span key={i} style={{ color: getDieColor(d.value, d.sides) }}>
      {d.sign === -1 ? '- ' : ''}{d.value}
    </span>
  )).reduce((acc, d) => [
    ...acc,
    d,
    <span key={`sep-${d.key}`} className="text-[#666]"> +</span>
  ], []);
  if (diceDisplay.length > 0) diceDisplay.pop(); // Remove trailing +

  return (
    <div className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-1 sm:p-2 mb-1 sm:mb-2 transition-all duration-200 hover:bg-[#1a1a1a] origin-center">
      <div className="flex gap-1 sm:gap-2">
        <div className="flex items-center justify-center" style={{ minWidth: '2.4rem', width: 'fit-content' }}>
          <span style={getTotalColor()} className="text-[24px] sm:text-[36px] font-bold whitespace-nowrap overflow-hidden" title={total.toString()}>{total}</span>
        </div>
        <div className="flex gap-1 flex-row items-center shrink-0">
          <button
            onClick={() => onRollAgain && onRollAgain(result.command || result.formula)}
            className="w-8 h-8 rounded border border-[#666] text-[#666] hover:bg-[#cd7f32] hover:text-[#0a0a0a] hover:border-[#cd7f32] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
          >
            ⟳
          </button>
          <button
            onClick={() => onSave && onSave(result)}
            className="w-8 h-8 rounded border border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-[#e0e0e0] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
          >
            ★
          </button>
        </div>
        <div className="flex flex-col justify-center gap-0.5 sm:gap-1 flex-1 min-w-0">
          <span className="text-[#cd7f32] font-bold text-xs sm:text-sm whitespace-nowrap overflow-hidden" title={result.command || result.formula}>
            {result.command || result.formula}
          </span>
          <div className="text-[#666] text-xs sm:text-sm flex items-center gap-0.5 sm:gap-1 whitespace-nowrap overflow-hidden" title={`${diceDisplay}${modifier !== 0 ? modifierDisplay : ''}`}>
            {diceDisplay}
            {modifier !== 0 && <span>{modifierDisplay}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

RollResult.propTypes = {
  result: PropTypes.shape({
    total: PropTypes.number.isRequired,
    dice: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        sides: PropTypes.number.isRequired,
      })
    ).isRequired,
    minPossible: PropTypes.number.isRequired,
    maxPossible: PropTypes.number.isRequired,
    formula: PropTypes.string.isRequired,
    command: PropTypes.string,
    parts: PropTypes.arrayOf(PropTypes.shape({
      modifier: PropTypes.number,
    })),
  }).isRequired,
  onSave: PropTypes.func,
  onRollAgain: PropTypes.func,
};