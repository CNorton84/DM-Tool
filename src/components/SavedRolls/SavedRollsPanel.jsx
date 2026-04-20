import { DndContext, closestCenter, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { SortableSavedRollItem } from './SortableSavedRollItem';
import { useCallback } from 'react';
import PropTypes from 'prop-types';

export const SavedRollsPanel = ({ savedRolls, onRoll, onUpdate, onDelete, onReorder }) => {
  const sensors = useSensors(
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, { coordinateGetter: undefined })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = savedRolls.findIndex((roll) => roll.id === active.id);
      const newIndex = savedRolls.findIndex((roll) => roll.id === over.id);
      if (onReorder) {
        const newOrder = [...savedRolls];
        const [removed] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, removed);
        onReorder(newOrder);
      }
    }
  }, [savedRolls, onReorder]);

  if (savedRolls.length === 0) {
    return (
      <div className="text-[#888] text-center py-12">
        <p className="text-xl font-bold mb-2">No saved rolls</p>
        <p className="text-base">Click the star icon on any roll to save it.</p>
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
        items={savedRolls.map((r) => r.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 overflow-hidden">
          {savedRolls.map((roll) => (
            <SortableSavedRollItem
              key={roll.id}
              roll={roll}
              onRoll={onRoll}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

SavedRollsPanel.propTypes = {
  savedRolls: PropTypes.array.isRequired,
  onRoll: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReorder: PropTypes.func,
};
