# Combatant Tracker Implementation Plan

## Overview

This plan details the implementation of the Combatant Tracker feature - a system for tracking combatants (enemies, NPCs, players) during encounters with HP tracking, damage application, and card duplication.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  DiceProvider (context/DiceContext.jsx)                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  CombatantTracker (components/CombatantTracker/)     │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │  CombatantList                                │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │  CombatantCard                           │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │  Editable Name                    │  │  │  │  │  │
│  │  │  │  │  │  Total HP (editable)              │  │  │  │  │  │
│  │  │  │  │  │  Current HP (editable)            │  │  │  │  │  │
│  │  │  │  │  │  Damage Input + Apply Button      │  │  │  │  │  │
│  │  │  │  │  │  Description Textarea (auto-scale)│  │  │  │  │  │
│  │  │  │  │  │  Duplicate Button                 │  │  │  │  │  │
│  │  │  │  │  │  Remove Button                    │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model

### Combatant Object
```js
{
  id: 'combatant-1234567890-abc123def',  // format: combatant-{timestamp}-{random}
  name: 'Goblin Warrior',                  // string, editable
  totalHp: 7,                              // number, editable
  currentHp: 7,                            // number, editable (starts equal to totalHp)
  description: '',                         // string, free-form text
  createdAt: 1713456789012                 // timestamp
}
```

### Storage
- Stored in localStorage key: `dm-app-combatants`
- Default empty array `[]` if not set
- Defensive parsing with try/catch (same pattern as saved rolls)

## File Structure

```
src/
├── context/
│   └── DiceContext.jsx              [MODIFY] Add combatant state & actions
├── hooks/
│   └── useCombatantTracker.js       [CREATE] Custom hook for combatant logic
├── components/
│   └── CombatantTracker/
│       ├── CombatantTracker.jsx     [MODIFY] Replace placeholder with real component
│       ├── CombatantCard.jsx        [CREATE] Individual combatant card
│       └── CombatantList.jsx        [CREATE] List container
└── constants.js                     [MODIFY] Add combatant constants
```

## Component Details

### 1. CombatantCard Component

Props: `combatant`, `onRemove`, `onUpdate`, `onDuplicate`

Structure (modeled after SavedRollItem):
```
┌─────────────────────────────────────────────────────────┐
│  [Editable Name - gold, bold]                            │
│                                                          │
│  Total HP: [input]  Current HP: [input]                 │
│                                                          │
│  [-] Damage: [input] [Apply] [+]                         │
│                                                          │
│  [Textarea - auto-scaling, mono font]                    │
│                                                          │
│  [Duplicate] [Remove]                                    │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- **Editable Name**: Click to edit, blur to save (inline editing like EditLabelModal pattern)
- **Total HP Input**: Number input, editable
- **Current HP Input**: Number input, editable
- **Damage Input**: Text input that accepts positive (damage) or negative (healing) numbers
- **Apply Button**: Subtracts input value from currentHp, clears input
- **Description Textarea**: Auto-scaling (use `resize: none` with `onInput` to adjust height)
- **Duplicate Button**: Creates a copy with a new ID
- **Remove Button**: Removes the combatant from the list

### 2. CombatantList Component

Props: `combatants`, `onAddCombatant`, `onRemoveCombatant`, `onUpdateCombatant`, `onDuplicateCombatant`

Structure:
```
<div className="space-y-4">
  <button>Add Combatant</button>
  {combatants.map(combatant => (
    <CombatantCard key={combatant.id} ... />
  ))}
</div>
```

### 3. CombatantTracker Component

The container component that:
- Uses the `useCombatantTracker` hook
- Renders CombatantList
- Passes callback handlers down

### 4. useCombatantTracker Hook

Returns: `{ combatants, addCombatant, removeCombatant, updateCombatant, duplicateCombatant }`

Actions:
- `addCombatant()`: Creates a new combatant with default values
- `removeCombatant(id)`: Removes combatant by ID
- `updateCombatant(id, updates)`: Updates specific fields
- `duplicateCombatant(id)`: Finds combatant by ID, creates copy with new ID
- `applyDamage(id, amount)`: Subtracts amount from currentHp (with minimum of 0)

## Context Integration

### DiceContext Additions

Add to the context value object:
```js
const [combatants, setCombatants] = useState(() => {
  const saved = localStorage.getItem('dm-app-combatants');
  return saved ? JSON.parse(saved) : [];
});

// Actions:
const addCombatant = useCallback(() => {
  const newCombatant = {
    id: `combatant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: 'New Combatant',
    totalHp: 10,
    currentHp: 10,
    description: '',
    createdAt: Date.now(),
  };
  setCombatants((prev) => {
    const updated = [newCombatant, ...prev];
    localStorage.setItem('dm-app-combatants', JSON.stringify(updated));
    return updated;
  });
  return newCombatant;
}, []);

const removeCombatant = useCallback((id) => {
  setCombatants((prev) => {
    const filtered = prev.filter((c) => c.id !== id);
    localStorage.setItem('dm-app-combatants', JSON.stringify(filtered));
    return filtered;
  });
}, []);

const updateCombatant = useCallback((id, updates) => {
  setCombatants((prev) => {
    const updated = prev.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    localStorage.setItem('dm-app-combatants', JSON.stringify(updated));
    return updated;
  });
}, []);

const duplicateCombatant = useCallback((id) => {
  setCombatants((prev) => {
    const source = prev.find((c) => c.id === id);
    if (!source) return prev;
    const copy = {
      ...source,
      id: `combatant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `${source.name} (copy)`,
      currentHp: source.totalHp,
      createdAt: Date.now(),
    };
    const updated = [copy, ...prev];
    localStorage.setItem('dm-app-combatants', JSON.stringify(updated));
    return updated;
  });
}, []);

const applyDamage = useCallback((id, amount) => {
  setCombatants((prev) => {
    const updated = prev.map((c) => {
      if (c.id !== id) return c;
      const newHp = Math.max(0, c.currentHp - amount);
      return { ...c, currentHp: newHp };
    });
    localStorage.setItem('dm-app-combatants', JSON.stringify(updated));
    return updated;
  });
}, []);
```

## Styling Guidelines

Following existing patterns:
- Card background: `bg-[#0a0a0a]` with `border-[#cd7f32]`
- Text: `text-[#e0e0e0]` for body, `text-[#cd7f32]` for accents
- Input styling: Dark backgrounds with gold borders
- Buttons: Consistent with existing Button/IconButton patterns
- Auto-scaling textarea: `resize: none` + dynamic height adjustment

## Implementation Order

1. **Update constants.js** - Add `MAX_COMBATANTS` constant
2. **Update DiceContext.jsx** - Add combatant state and actions
3. **Create useCombatantTracker.js** - Custom hook (can also be skipped if context is sufficient)
4. **Create CombatantCard.jsx** - Individual card component
5. **Create CombatantList.jsx** - List container
6. **Update CombatantTracker.jsx** - Replace placeholder
7. **Update App.jsx** - Pass combatant props to CombatantTracker

## Edge Cases to Handle

- HP values must be non-negative integers
- Damage input should handle negative numbers (healing)
- Empty combatant list shows placeholder message
- Duplicate when combatant doesn't exist (no-op)
- Auto-scaling textarea should have min/max height
- Name input should trim whitespace
- Very long names should truncate with ellipsis

## Questions for Review

1. Should combatants be cleared when a new encounter starts, or persist across sessions?
2. Should there be visual indication when HP is at 0 (dead combatant)?
3. Should there be a "Clear All" button to reset all combatants?
