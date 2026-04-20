import { SavedRollItem } from './SavedRollItem';

export const SavedRollsPanel = ({ savedRolls, onRoll, onUpdate, onDelete }) => {
  if (savedRolls.length === 0) {
    return (
      <div className="text-[#888] text-center py-12">
        <p className="text-xl font-bold mb-2">📋 No saved rolls</p>
        <p className="text-base">Click the star icon on any roll to save it.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {savedRolls.map((roll) => (
        <SavedRollItem
          key={roll.id}
          roll={roll}
          onRoll={onRoll}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
