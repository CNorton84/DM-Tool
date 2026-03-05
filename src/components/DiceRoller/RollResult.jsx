import PropTypes from 'prop-types';

export const RollResult = ({ result, onSave, onRollAgain }) => {
  const { total, dice, minPossible, maxPossible } = result;

  const getDieColor = (value, sides) => {
    if (value === 1) return 'text-[#ef4444]';
    if (value === sides) return 'text-[#22c55e]';
    return 'text-[#e0e0e0]';
  };

  const getTotalColor = () => {
    const range = maxPossible - minPossible;
    const position = range > 0 ? (total - minPossible) / range : 0.5;
    const r = Math.round(255 * (1 - position));
    const g = Math.round(255 * position);
    return { color: `rgb(${r}, ${g}, 0)` };
  };

  const modifier = result.parts?.reduce((sum, p) => p.type === 'modifier' ? sum + p.value : sum, 0) || 0;
  const modifierDisplay = modifier !== 0 ? ` ${modifier > 0 ? '+ ' : '- '}${Math.abs(modifier)}` : '';
  const diceDisplay = dice.map((d, i) => (
    <span key={i} style={{ color: `rgb(${255 * (1 - (d.value - 1) / (d.sides - 1))}, ${255 * (d.value - 1) / (d.sides - 1)}, 0)` }}>
      {d.sign === -1 ? '- ' : ''}{d.value}
    </span>
  )).reduce((acc, d) => [
    ...acc,
    d,
    <span key={`sep-${d.key}`} className="text-[#666]"> +</span>
  ], []);
  if (diceDisplay.length > 0) diceDisplay.pop(); // Remove trailing +

  return (
    <div className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2 mb-2 transition-all duration-200 hover:bg-[#1a1a1a] origin-center">
      <div className="flex gap-2">
        <div className="flex items-center justify-center" style={{ minWidth: '3.6rem', width: 'fit-content' }}>
          <span style={getTotalColor()} className="text-[36px] font-bold whitespace-nowrap overflow-hidden" title={total.toString()}>{total}</span>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onRollAgain && onRollAgain(result.command || result.formula)}
            className="w-5 h-5 rounded border border-[#666] text-[#666] hover:bg-[#cd7f32] hover:text-[#0a0a0a] hover:border-[#cd7f32] transition-all duration-200 font-mono text-sm flex items-center justify-center"
          >
            ⟳
          </button>
          <button
            onClick={() => onSave && onSave(result)}
            className="w-5 h-5 rounded border border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-[#e0e0e0] transition-all duration-200 font-mono text-sm flex items-center justify-center"
          >
            ★
          </button>
        </div>
        <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
          <span className="text-[#cd7f32] font-bold text-sm whitespace-nowrap overflow-hidden" title={result.command || result.formula}>
            {result.command || result.formula}
          </span>
          <div className="text-[#666] text-sm flex items-center gap-1 whitespace-nowrap overflow-hidden" title={`${diceDisplay}${modifier !== 0 ? modifierDisplay : ''}`}>
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