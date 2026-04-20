import { useDiceContext } from '../../context/DiceContext';
import { CombatantList } from './CombatantList';
import { Button } from '../UI/Button';

export const CombatantTracker = ({ onReorder }) => {
  const { combatants, addCombatant, removeCombatant, updateCombatant, duplicateCombatant, applyDamage } = useDiceContext();

  const handleAddCombatant = () => {
    addCombatant({});
  };

  const handleUpdate = (id, updates) => {
    updateCombatant(id, updates);
  };

  const handleRemove = (id) => {
    removeCombatant(id);
  };

  const handleDuplicate = (id) => {
    duplicateCombatant(id);
  };

  const handleApplyDamage = (id, amount) => {
    applyDamage(id, amount);
  };

  return (
    <div className="space-y-2">
      {/* Add Combatant Button */}
      <Button
        onClick={handleAddCombatant}
        variant="primary"
        className="w-full"
      >
        + Add Combatant
      </Button>

      {/* Combatant List */}
      <CombatantList
        combatants={combatants}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        onDuplicate={handleDuplicate}
        onApplyDamage={handleApplyDamage}
        onReorder={onReorder}
      />
    </div>
  );
};
