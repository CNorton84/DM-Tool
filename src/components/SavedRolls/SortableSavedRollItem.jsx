import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import { SavedRollItem } from './SavedRollItem';

export const SortableSavedRollItem = ({ roll, onRoll, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: roll.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : undefined,
  };

  return (
    <div style={style} data-dnd-sortable-item>
      <SavedRollItem
        roll={roll}
        onRoll={onRoll}
        onUpdate={onUpdate}
        onDelete={onDelete}
        setNodeRef={setNodeRef}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
};

SortableSavedRollItem.propTypes = {
  roll: PropTypes.shape({
    id: PropTypes.string.isRequired,
    command: PropTypes.string.isRequired,
    label: PropTypes.string,
  }).isRequired,
  onRoll: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};