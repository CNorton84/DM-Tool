import PropTypes from 'prop-types';

export const SavedRollItem = ({ roll, onRoll, onEdit, onDelete }) => {
  const { command, label } = roll;

  return (
    <div className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2 mb-2 transition-all duration-200 hover:bg-[#1a1a1a] origin-center">
      <div className="flex flex-col">
        <div className="flex-1 min-w-0 mb-1">
          {label ? (
            <h3 className="text-[#cd7f32] font-bold text-base whitespace-nowrap overflow-hidden" title={label}>{label}</h3>
          ) : (
            <span className="text-[#888] text-base whitespace-nowrap overflow-hidden" title={command}>{command}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#666] text-sm font-mono whitespace-nowrap overflow-hidden" title={command}>{command}</span>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onRoll(command)}
              className="w-6 h-6 rounded border border-[#cd7f32] text-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a] transition-all duration-200 font-mono text-sm flex items-center justify-center"
            >
              ⟳
            </button>
            <button
              onClick={() => onEdit(roll)}
              className="w-6 h-6 rounded border border-[#9333ea] text-[#9333ea] hover:bg-[#9333ea] hover:text-[#e0e0e0] transition-all duration-200 font-mono text-sm flex items-center justify-center"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(roll.id)}
              className="w-6 h-6 rounded border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-[#e0e0e0] transition-all duration-200 font-mono text-sm flex items-center justify-center"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SavedRollItem.propTypes = {
  roll: PropTypes.shape({
    id: PropTypes.string.isRequired,
    command: PropTypes.string.isRequired,
    label: PropTypes.string,
  }).isRequired,
  onRoll: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
