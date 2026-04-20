import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

export const SavedRollItem = ({ roll, onRoll, onUpdate, onDelete, attributes, listeners, setNodeRef }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(roll.label || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setEditValue(roll.label || '');
    setIsEditing(true);
  };

  const handleEditSave = () => {
    setIsEditing(false);
    if (editValue.trim() !== (roll.label || '')) {
      onUpdate(roll.id, { label: editValue.trim() || roll.command });
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditValue(roll.label || '');
      setIsEditing(false);
    }
  };

  const { command, label } = roll;

  return (
    <div ref={setNodeRef} className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-1.5 sm:p-2 transition-all duration-200 hover:bg-[#1a1a1a] origin-center">
      <div className="flex flex-col">
        <div className="flex-1 min-w-0 mb-0.5 sm:mb-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleEditKeyDown}
              className="w-full bg-[#0a0a0a] border border-[#cd7f32] rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-[#cd7f32] font-bold text-xs sm:text-base focus:outline-none"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 w-full text-left truncate">
                <button
                  className="cursor-grab active:cursor-grabbing flex-shrink-0 p-1 -ml-1 mt-0.5"
                {...attributes}
                {...listeners}
                aria-label="Drag to reorder"
                tabIndex={-1}
              >
                <svg width="12" height="16" viewBox="0 0 12 16" fill="#666">
                  <circle cx="3" cy="2" r="1.5" />
                  <circle cx="9" cy="2" r="1.5" />
                  <circle cx="3" cy="8" r="1.5" />
                  <circle cx="9" cy="8" r="1.5" />
                  <circle cx="3" cy="14" r="1.5" />
                  <circle cx="9" cy="14" r="1.5" />
                </svg>
              </button>
              <button
                onClick={handleEditStart}
                className="truncate"
                title={label || command}
              >
                {label ? (
                  <h3 className="text-[#cd7f32] font-bold text-xs sm:text-base whitespace-nowrap hover:text-[#e0e0e0]">{label}</h3>
                ) : (
                  <span className="text-[#888] text-xs sm:text-base whitespace-nowrap">{command}</span>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#666] text-xs sm:text-sm font-mono whitespace-nowrap overflow-hidden" title={command}>{command}</span>
          <div className="flex gap-2 sm:gap-1 flex-shrink-0">
            <button
              onClick={() => onRoll(command)}
              className="w-8 h-8 sm:w-6 sm:h-6 rounded border border-[#cd7f32] text-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
            >
              ⟳
            </button>
            <button
              onClick={() => onDelete(roll.id)}
              className="w-8 h-8 sm:w-6 sm:h-6 rounded border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-[#e0e0e0] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SavedRollItem.propTypes = {
  roll: PropTypes.shape({
    id: PropTypes.string.isRequired,
    command: PropTypes.string.isRequired,
    label: PropTypes.string,
  }).isRequired,
  onRoll: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  attributes: PropTypes.object,
  listeners: PropTypes.object,
};
