import PropTypes from 'prop-types';
import { RollResult } from './RollResult';

export const RollHistory = ({ history, onSave, onRollAgain }) => {

  if (history.length === 0) {
    return (
      <div className="text-[#888] text-center py-12">
        <p className="text-base font-bold">No rolls yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((result) => (
        <RollResult
          key={result.id}
          result={result}
          onSave={onSave}
          onRollAgain={onRollAgain}
        />
      ))}
    </div>
  );
};

RollHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSave: PropTypes.func.isRequired,
  onRollAgain: PropTypes.func,
};
