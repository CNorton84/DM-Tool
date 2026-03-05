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
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="e.g., 2d6+1"
            className="flex-1 min-w-0 bg-[#0a0a0a] border border-[#cd7f32] rounded px-5 py-3 text-[#e0e0e0] text-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#9333ea] transition-all duration-200"
          />
          <button
            type="submit"
            className="shrink px-8 py-3 bg-[#cd7f32] text-[#0a0a0a] font-bold rounded hover:bg-[#b86d2a] transition-all duration-200 hover:-translate-y-0.5 font-mono"
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