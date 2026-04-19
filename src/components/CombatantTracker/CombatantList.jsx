import PropTypes from 'prop-types';
import { CombatantCard } from './CombatantCard';

export const CombatantList = ({ combatants, onUpdate, onRemove, onDuplicate, onApplyDamage }) => {
  if (combatants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#888]">
        <div className="text-center">
          <p className="text-lg font-bold mb-2">No Combatants</p>
          <p className="text-sm">Add a combatant to begin tracking</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {combatants.map((combatant) => (
        <CombatantCard
          key={combatant.id}
          combatant={combatant}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          onApplyDamage={onApplyDamage}
        />
      ))}
    </div>
  );
};

CombatantList.propTypes = {
  combatants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      totalHp: PropTypes.number.isRequired,
      currentHp: PropTypes.number.isRequired,
      description: PropTypes.string,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onApplyDamage: PropTypes.func.isRequired,
};
