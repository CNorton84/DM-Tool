import PropTypes from 'prop-types';

export const ErrorModal = ({ error, onClose }) => {
  const { message, position, input } = error;

  // Highlight the character at the error position
  const getHighlightedInput = () => {
    if (position === undefined || position === null || !input || position >= input.length) {
      return input || '';
    }
    const before = input.slice(0, position);
    const char = input[position];
    const after = input.slice(position + 1);
    return (
      <span className="font-mono">
        {before}
        <span className="bg-[#cd7f32] text-[#0a0a0a] px-1 rounded">{char}</span>
        {after}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] border-2 border-[#cd7f32] rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-[#cd7f32] font-bold text-xl font-mono">Invalid Dice Command</h3>
          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#cd7f32] transition-colors duration-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-[#e0e0e0] text-base mb-2">{message}</p>
          {input && (
            <div className="bg-[#0a0a0a] border border-[#333] rounded p-3 mt-3">
              <p className="text-[#666] text-xs mb-1 font-mono">Your input:</p>
              <p className="text-[#e0e0e0] text-sm break-all">
                {getHighlightedInput()}
              </p>
              {position !== undefined && position !== null && (
                <p className="text-[#666] text-xs mt-2 font-mono">Error at position {position}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#cd7f32] text-[#0a0a0a] font-bold rounded hover:bg-[#b86d2a] transition-all duration-200 font-mono"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorModal.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    code: PropTypes.string,
    position: PropTypes.number,
    input: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
