import { DndContext, closestCenter, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableCombatantCard } from './SortableCombatantCard';
import { useCallback } from 'react';
import PropTypes from 'prop-types';

export const CombatantList = ({ combatants, onUpdate, onRemove, onDuplicate, onApplyDamage, onReorder }) => {
  const sensors = useSensors(
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, { coordinateGetter: undefined })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = combatants.findIndex((c) => c.id === active.id);
      const newIndex = combatants.findIndex((c) => c.id === over.id);
      const newOrder = [...combatants];
      const [removed] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, removed);
      if (onReorder) {
        onReorder(newOrder);
      }
    }
  }, [combatants, onReorder]);

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={combatants.map((c) => c.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 overflow-hidden">
          {combatants.map((combatant) => (
            <SortableCombatantCard
              key={combatant.id}
              combatant={combatant}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onDuplicate={onDuplicate}
              onApplyDamage={onApplyDamage}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
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
  onReorder: PropTypes.func,
};
