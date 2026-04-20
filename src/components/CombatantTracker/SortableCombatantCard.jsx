import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import { CombatantCard } from './CombatantCard';

export const SortableCombatantCard = ({ combatant, onUpdate, onRemove, onDuplicate, onApplyDamage }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: combatant.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : undefined,
  };

  return (
    <div style={style} data-dnd-sortable-item>
      <CombatantCard
        combatant={combatant}
        onUpdate={onUpdate}
        onRemove={onRemove}
        onDuplicate={onDuplicate}
        onApplyDamage={onApplyDamage}
        setNodeRef={setNodeRef}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
};

SortableCombatantCard.propTypes = {
  combatant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    totalHp: PropTypes.number.isRequired,
    currentHp: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onApplyDamage: PropTypes.func.isRequired,
};