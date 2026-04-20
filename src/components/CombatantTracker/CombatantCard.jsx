import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../UI/Button';
import { parseDiceCommand, rollDice } from '../../utils/diceParser';

export const CombatantCard = ({ combatant, onUpdate, onRemove, onDuplicate, onApplyDamage, attributes, listeners, setNodeRef }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(combatant.name);
  const nameInputRef = useRef(null);
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.select();
    }
  }, [isEditingName]);
  
  const [damageValue, setDamageValue] = useState('');
  const [isEditingMaxHp, setIsEditingMaxHp] = useState(false);
  const [maxHpValue, setMaxHpValue] = useState(String(combatant.totalHp));
  const maxHpInputRef = useRef(null);
  useEffect(() => {
    if (isEditingMaxHp && maxHpInputRef.current) {
      maxHpInputRef.current.select();
    }
  }, [isEditingMaxHp]);
  
  const [isEditingCurrentHp, setIsEditingCurrentHp] = useState(false);
  const [currentHpValue, setCurrentHpValue] = useState(String(combatant.currentHp));
  const currentHpInputRef = useRef(null);
  useEffect(() => {
    if (isEditingCurrentHp && currentHpInputRef.current) {
      currentHpInputRef.current.select();
    }
  }, [isEditingCurrentHp]);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameValue.trim() !== combatant.name) {
      onUpdate(combatant.id, { name: nameValue.trim() || 'Unnamed Combatant' });
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setNameValue(combatant.name);
      setIsEditingName(false);
    }
  };

  const handleMaxHpBlur = () => {
    setIsEditingMaxHp(false);
    const newMaxHp = parseInt(maxHpValue, 10) || 0;
    if (newMaxHp !== combatant.totalHp) {
      const newCurrentHp = Math.min(combatant.currentHp, newMaxHp);
      onUpdate(combatant.id, { totalHp: newMaxHp, currentHp: newCurrentHp });
    }
  };

  const handleMaxHpKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleMaxHpBlur();
    } else if (e.key === 'Escape') {
      setMaxHpValue(String(combatant.totalHp));
      setIsEditingMaxHp(false);
    }
  };

  const handleCurrentHpBlur = () => {
    setIsEditingCurrentHp(false);
    const newCurrentHp = parseInt(currentHpValue, 10) || 0;
    if (newCurrentHp !== combatant.currentHp) {
      onUpdate(combatant.id, { currentHp: Math.max(0, newCurrentHp) });
    }
  };

  const handleCurrentHpKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCurrentHpBlur();
    } else if (e.key === 'Escape') {
      setCurrentHpValue(String(combatant.currentHp));
      setIsEditingCurrentHp(false);
    }
  };

  const handleDamageApply = () => {
    const trimmed = damageValue.trim();
    if (!trimmed) return;

    const parsed = parseDiceCommand(trimmed);
    if (parsed.valid) {
      const result = rollDice(parsed.parts);
      onApplyDamage(combatant.id, -result.total);
    }
    setDamageValue('');
  };

  const handleDamageKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDamageApply();
    }
  };

  const handleDescriptionInput = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    onUpdate(combatant.id, { description: textarea.value });
  };

  const hpPercentage = combatant.totalHp > 0
    ? Math.max(0, (combatant.currentHp / combatant.totalHp) * 100)
    : 100;

  const getHpColor = () => {
    if (hpPercentage > 50) return 'bg-green-600';
    if (hpPercentage > 25) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div ref={setNodeRef} className={`bg-[#1a1a1a] border rounded-lg p-1.5 sm:p-2 mb-0 transition-all duration-200 overflow-hidden ${
      combatant.currentHp <= 0
        ? 'border-red-800 opacity-70'
        : combatant.currentHp <= combatant.totalHp * 0.25
        ? 'border-red-700'
        : 'border-[#cd7f32] border-opacity-50'
    }`}>
      {/* Header: Name only */}
      <div className="min-w-0 mb-1.5 sm:mb-2">
        {isEditingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="w-full bg-[#0a0a0a] border border-[#cd7f32] rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-sm sm:text-base text-[#e0e0e0] focus:outline-none focus:border-opacity-100"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 text-left">
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
              onClick={() => setIsEditingName(true)}
              className="text-sm sm:text-base font-bold text-[#e0e0e0] hover:text-[#cd7f32] truncate"
              title="Click to edit name"
            >
              {combatant.name}
            </button>
          </div>
        )}
      </div>

      {/* HP Display + Buttons Row */}
      <div className="mb-1.5 sm:mb-2 overflow-hidden">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Current HP */}
            {isEditingCurrentHp ? (
              <input
                ref={currentHpInputRef}
                type="text"
                inputMode="numeric"
                pattern="-?[0-9]*"
                value={currentHpValue}
                onChange={(e) => setCurrentHpValue(e.target.value)}
                onBlur={handleCurrentHpBlur}
                onKeyDown={handleCurrentHpKeyDown}
                className="w-12 sm:w-16 bg-[#0a0a0a] border border-[#cd7f32] rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-sm sm:text-base text-[#e0e0e0] focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingCurrentHp(true)}
                className={`text-sm sm:text-base font-bold ${
                  combatant.currentHp <= 0
                    ? 'text-red-500'
                    : combatant.currentHp <= combatant.totalHp * 0.25
                    ? 'text-yellow-500'
                    : 'text-[#e0e0e0]'
                } hover:text-[#cd7f32]`}
                title="Click to edit current HP"
              >
                {combatant.currentHp}
              </button>
            )}
            <span className="text-[#888] text-xs">/</span>
            {/* Max HP */}
            {isEditingMaxHp ? (
              <input
                ref={maxHpInputRef}
                type="text"
                inputMode="numeric"
                pattern="-?[0-9]*"
                value={maxHpValue}
                onChange={(e) => setMaxHpValue(e.target.value)}
                onBlur={handleMaxHpBlur}
                onKeyDown={handleMaxHpKeyDown}
                className="w-12 sm:w-16 bg-[#0a0a0a] border border-[#cd7f32] rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-sm sm:text-base text-[#e0e0e0] focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingMaxHp(true)}
                className="text-sm sm:text-base text-[#e0e0e0] hover:text-[#cd7f32]"
                title="Click to edit max HP"
              >
                {combatant.totalHp}
              </button>
            )}
          </div>
          <div className="flex gap-2 sm:gap-1 flex-shrink-0 ml-2">
            <button
              onClick={() => onDuplicate(combatant.id)}
              className="w-8 h-8 rounded border border-[#888] text-[#888] hover:text-[#cd7f32] hover:border-[#cd7f32] hover:bg-[#2a2a2a] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
              title="Duplicate combatant"
            >
              📋
            </button>
            <button
              onClick={() => onRemove(combatant.id)}
              className="w-8 h-8 rounded border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-[#e0e0e0] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
              title="Remove combatant"
            >
              ✕
            </button>
          </div>
        </div>

        {/* HP Bar */}
        <div className="w-full bg-[#0a0a0a] rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div
            className={`h-full ${getHpColor()} transition-all duration-300`}
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* Damage Input */}
      <div className="flex items-center gap-0.5 sm:gap-1 mb-1.5 sm:mb-2 flex-shrink-0">
        <span className="text-[10px] sm:text-xs text-[#888] whitespace-nowrap">Damage:</span>
        <input
          type="text"
          value={damageValue}
          onChange={(e) => setDamageValue(e.target.value)}
          onKeyDown={handleDamageKeyDown}
          placeholder="e.g., 2d6+3"
          className="flex-1 min-w-0 bg-[#0a0a0a] border border-[#333] rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm text-[#e0e0e0] focus:outline-none focus:border-[#cd7f32]"
        />
        <Button
          onClick={handleDamageApply}
          size="sm"
          variant="primary"
        >
          Apply
        </Button>
      </div>

      {/* Description Textarea */}
      <textarea
        value={combatant.description || ''}
        onInput={handleDescriptionInput}
        placeholder="Add notes..."
        className="w-full min-w-0 bg-[#0a0a0a] border border-[#333] rounded px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs sm:text-sm text-[#e0e0e0] focus:outline-none focus:border-[#cd7f32] resize-none overflow-hidden"
        ref={(textarea) => {
          if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
          }
        }}
        rows={1}
      />
    </div>
  );
};

CombatantCard.propTypes = {
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
  attributes: PropTypes.object,
  listeners: PropTypes.object,
};
