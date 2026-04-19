import { useState } from 'react';
import PropTypes from 'prop-types';
import { ErrorModal } from '../UI/ErrorModal';

export const RollInput = ({ onRoll }) => {
  const [command, setCommand] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      const result = onRoll(command);
      if (result && result.error) {
        setError(result.error);
      } else {
        setError(null);
        setCommand('');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-3 sm:mb-6">
        <div className="flex gap-2 sm:gap-4 flex-nowrap sm:flex-nowrap">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g., 2d6+1"
            className="flex-1 min-w-0 bg-[#0a0a0a] border border-[#cd7f32] rounded px-2 py-1.5 sm:px-5 sm:py-3 text-[#e0e0e0] text-sm sm:text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#9333ea] transition-all duration-200"
          />
          <button
            type="submit"
            className="shrink px-4 py-2 sm:px-8 sm:py-3 bg-[#cd7f32] text-[#0a0a0a] font-bold rounded hover:bg-[#b86d2a] transition-all duration-200 hover:-translate-y-0.5 text-xs sm:text-base font-mono"
          >
            Roll
          </button>
        </div>
      </form>
      {error && <ErrorModal error={error} onClose={() => setError(null)} />}
    </>
  );
};

RollInput.propTypes = {
  onRoll: PropTypes.func.isRequired,
};