import { RollInput } from './RollInput';
import { RollHistory } from './RollHistory';

export const DiceRoller = ({ onRoll, history, onSave }) => {
  return (
    <div className="flex flex-col h-full">
      <RollInput onRoll={onRoll} />
      <div className="flex-1 overflow-y-auto">
        <RollHistory history={history} onSave={onSave} onRollAgain={onRoll} />
      </div>
    </div>
  );
};
