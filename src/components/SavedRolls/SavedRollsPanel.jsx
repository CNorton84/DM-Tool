import { useState } from 'react';
import { SavedRollItem } from './SavedRollItem';
import { EditLabelModal } from './EditLabelModal';

export const SavedRollsPanel = ({ savedRolls, onRoll, onUpdate, onDelete }) => {
  const [editingRoll, setEditingRoll] = useState(null);

  const handleEdit = (roll) => {
    setEditingRoll(roll);
  };

  const handleCloseModal = () => {
    setEditingRoll(null);
  };

  const handleSave = (id, updates) => {
    onUpdate(id, updates);
    setEditingRoll(null);
  };

  if (savedRolls.length === 0) {
    return (
      <div className="text-[#888] text-center py-12">
        <p className="text-xl font-bold mb-2">📋 No saved rolls</p>
        <p className="text-base">Click the star icon on any roll to save it.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-4">
        {savedRolls.map((roll) => (
          <SavedRollItem
            key={roll.id}
            roll={roll}
            onRoll={onRoll}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      {editingRoll && (
        <EditLabelModal
          roll={editingRoll}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
