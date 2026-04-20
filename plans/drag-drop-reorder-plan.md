# Drag-and-Drop Reorder Plan

## Overview

Add touch-friendly drag-and-drop reordering to SavedRolls and CombatantTracker card lists using `@dnd-kit/core` and `@dnd-kit/sortable`.

**Status: Implemented** ✅

## Implementation Notes

- The drag handle buttons were removed from the inner components (`SavedRollItem`, `CombatantCard`)
- The dnd-kit props (`setNodeRef`, `attributes`, `listeners`) are applied directly to the outer divs of each card
- The entire card is now the drag target with `cursor-grab` / `active:cursor-grabbing` styling
- The sortable wrappers (`SortableSavedRollItem`, `SortableCombatantCard`) pass these props through to the inner components
- PointerSensor activation distance is set to 15px to prevent accidental drags when clicking buttons inside cards

## Cross-Column Reordering

The implementation supports dragging cards between columns in the 2-column grid layout:

### How It Works

The data model is a **flat array** — CSS grid handles the visual two-column layout:

```
Array: [A, B, C, D, E, F]
         ↓
Grid:  Col 1    Col 2
       A        B
       C        D
       E        F
```

When you drag card `A` (index 0) to position after `D` (index 3):

```
Array: [B, C, D, A, E, F]
         ↓
Grid:  Col 1    Col 2
       B        C
       D        A
       E        F
```

### Technical Details

- **SortableContext** operates on the flat array, not visual columns
- **rectSortingStrategy** enables cross-axis collision detection (both vertical and horizontal)
- **closestCenter** collision detection finds the nearest card regardless of column
- CSS grid (`grid-cols-1 lg:grid-cols-2`) automatically reflows items after array reordering

### User Experience

| Action | Result |
|--------|--------|
| Drag within same column | Item moves to new position in column |
| Drag from Col 1 to Col 2 | Item moves to target position, columns rebalance |
| Drag from Col 2 to Col 1 | Item moves to target position, columns rebalance |
| Drag on mobile (1 column) | Standard vertical reordering |

This is the standard behavior for multi-column sortable lists (similar to Pinterest, Trello, and Notion).

## Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

| Package | Purpose |
|---------|---------|
| `@dnd-kit/core` | Core drag-and-drop context and events |
| `@dnd-kit/sortable` | Sortable list logic and strategies |
| `@dnd-kit/utilities` | CSS class utilities and accessibility helpers |

**Bundle impact:** ~15KB gzipped combined.

---

## Architecture

```
src/
  components/
    UI/
      DragHandle.jsx          # Reusable grip icon drag handle
    SavedRolls/
      SavedRollsPanel.jsx     # Wrap with DndContext + SortableContext
      SavedRollItem.jsx       # Make sortable, add drag handle
    CombatantTracker/
      CombatantList.jsx       # Wrap with DndContext + SortableContext
      CombatantCard.jsx       # Make sortable, add drag handle
  hooks/
    useReorder.js             # Generic reorder utility hook
```

---

## Step 1: Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Step 2: Create `useReorder` Hook

**File:** `src/hooks/useReorder.js`

A generic hook for reordering arrays by index. Returns a function that moves an item from one position to another.

```js
import { useCallback } from 'react';

export const useReorder = () => {
  const reorder = useCallback((list, startIndex, endIndex) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }, []);

  return reorder;
};
```

---

## Step 3: Create `DragHandle` Component

**File:** `src/components/UI/DragHandle.jsx`

A small, non-interactive grip icon that serves as the drag trigger. Using `data-dnd-context` prevents event conflicts.

```jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';

export const DragHandle = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <button
        {...attributes}
        {...listeners}
        className="text-[#666] hover:text-[#cd7f32] cursor-grab active:cursor-grabbing p-1"
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="3" r="1.5" />
          <circle cx="11" cy="3" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="5" cy="13" r="1.5" />
          <circle cx="11" cy="13" r="1.5" />
        </svg>
      </button>
    </div>
  );
};

DragHandle.propTypes = {
  id: PropTypes.string.isRequired,
};
```

---

## Step 4: Integrate into SavedRolls

### 4a: Update `SavedRollsPanel.jsx`

Wrap with `DndContext` and `SortableContext`. Add `onDragEnd` handler to reorder the array.

**Changes:**
- Import `DndContext`, `SortableContext`, `verticalListSortingStrategy`, `useSortable`, `arrayMove`
- Add `isDragging` state for empty-state hiding
- Render `SortableSavedRollItem` wrapper instead of raw `SavedRollItem`
- Add `onDragEnd` callback that calls `setSavedRolls` with reordered array

```jsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SavedRollItem } from './SavedRollItem';
import { useReorder } from '../../hooks/useReorder';

export const SavedRollsPanel = ({ savedRolls, onRoll, onUpdate, onDelete, onReorder }) => {
  const reorder = useReorder();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = savedRolls.findIndex((roll) => roll.id === active.id);
      const newIndex = savedRolls.findIndex((roll) => roll.id === over.id);
      const newOrder = reorder(savedRolls, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (savedRolls.length === 0) {
    // ... existing empty state
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={savedRolls.map((r) => r.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
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
```

### 4b: Create `SortableSavedRollItem` Wrapper

**File:** `src/components/SavedRolls/SortableSavedRollItem.jsx` (new file)

This wrapper uses `useSortable` to make the item draggable, then renders `SavedRollItem` inside.

```jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PropTypes from 'prop-types';
import { SavedRollItem } from './SavedRollItem';
import { DragHandle } from '../UI/DragHandle';

export const SortableSavedRollItem = ({ roll, onRoll, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: roll.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className={`bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-1.5 sm:p-2 transition-all duration-200 hover:bg-[#1a1a1a] origin-center ${
          isDragging ? 'opacity-70 shadow-lg ring-2 ring-[#cd7f32] z-10' : ''
        }`}
      >
        <div className="flex items-start gap-1">
          <DragHandle id={roll.id} />
          <div className="flex-1 min-w-0">
            {/* Pass existing props to SavedRollItem */}
            <SavedRollItem
              roll={roll}
              onRoll={onRoll}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
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
```

### 4c: Add `reorderSavedRolls` to DiceContext

**File:** `src/context/DiceContext.jsx`

Add a new action to the context:

```js
const reorderSavedRolls = useCallback((newOrder) => {
  setSavedRolls((prev) => {
    if (JSON.stringify(prev) === JSON.stringify(newOrder)) return prev;
    localStorage.setItem('dm-app-saved-rolls', JSON.stringify(newOrder));
    return newOrder;
  });
}, []);
```

Include in value export:

```js
const value = {
  // ... existing
  reorderSavedRolls,
};
```

---

## Step 5: Integrate into CombatantTracker

### 5a: Update `CombatantList.jsx`

Same pattern as SavedRollsPanel.

```jsx
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CombatantCard } from './CombatantCard';
import { SortableCombatantCard } from './SortableCombatantCard';
import { useReorder } from '../../hooks/useReorder';

export const CombatantList = ({ combatants, onUpdate, onRemove, onDuplicate, onApplyDamage, onReorder }) => {
  const reorder = useReorder();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = combatants.findIndex((c) => c.id === active.id);
      const newIndex = combatants.findIndex((c) => c.id === over.id);
      const newOrder = reorder(combatants, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={combatants.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
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
```

### 5b: Create `SortableCombatantCard` Wrapper

**File:** `src/components/CombatantTracker/SortableCombatantCard.jsx` (new file)

Same pattern as `SortableSavedRollItem`.

### 5c: Add `reorderCombatants` to DiceContext

**File:** `src/context/DiceContext.jsx`

```js
const reorderCombatants = useCallback((newOrder) => {
  setCombatants((prev) => {
    if (JSON.stringify(prev) === JSON.stringify(newOrder)) return prev;
    localStorage.setItem('dm-app-combatants', JSON.stringify(newOrder));
    return newOrder;
  });
}, []);
```

Include in value export.

---

## Step 6: Update App.jsx

Wire up the new `onReorder` callbacks in the main App component.

```jsx
// SavedRolls
const handleReorderSavedRolls = useCallback((newOrder) => {
  reorderSavedRolls(newOrder);
}, [reorderSavedRolls]);

// CombatantTracker
const handleReorderCombatants = useCallback((newOrder) => {
  reorderCombatants(newOrder);
}, [reorderCombatants]);
```

Pass to panels:

```jsx
<SavedRollsPanel
  savedRolls={savedRolls}
  onRoll={handleRoll}
  onUpdate={updateSavedRoll}
  onDelete={removeSavedRoll}
  onReorder={handleReorderSavedRolls}
/>

<CombatantList
  combatants={combatants}
  onUpdate={updateCombatant}
  onRemove={removeCombatant}
  onDuplicate={duplicateCombatant}
  onApplyDamage={applyDamage}
  onReorder={handleReorderCombatants}
/>
```

---

## Step 7: Pointer Activation Constraint

The `PointerSensor` activation constraint of `distance: 8` means the user must drag 8 pixels before drag starts. This prevents accidental drags when:
- Tapping a button inside the card
- Editing text fields
- Clicking HP values

This is critical for usability since CombatantCard has many interactive elements.

---

## Visual Design

### Drag State Styling

| State | Visual |
|-------|--------|
| Normal | Standard card styling |
| Hover | `hover:bg-[#1a1a1a]` (existing) |
| Dragging | `opacity-70`, `shadow-lg`, `ring-2 ring-[#cd7f32]`, `z-10` |
| Drop target | Optional: highlight border with `useDraggable` + `isOver` |

### Drag Handle

- Positioned on the left edge of each card
- 6-dot grip pattern (SVG)
- Changes cursor: `cursor-grab` -> `cursor-grabbing`
- Non-interactive with `tabIndex={-1}` (keyboard navigation handled by @dnd-kit)

---

## Accessibility

| Feature | Implementation |
|---------|----------------|
| Keyboard reordering | `KeyboardSensor` with arrow keys |
| Screen reader labels | `aria-label="Drag to reorder"` on handle |
| Focus management | @dnd-kit handles focus during drag |
| Reduced motion | @dnd-kit respects `prefers-reduced-motion` |

---

## Files Changed Summary

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add 3 dependencies |
| `src/hooks/useReorder.js` | Create | Generic array reorder hook |
| `src/components/UI/DragHandle.jsx` | Create | Reusable drag handle component |
| `src/components/SavedRolls/SortableSavedRollItem.jsx` | Create | Sortable wrapper for SavedRollItem |
| `src/components/SavedRolls/SavedRollsPanel.jsx` | Modify | Wrap with DndContext |
| `src/components/CombatantTracker/SortableCombatantCard.jsx` | Create | Sortable wrapper for CombatantCard |
| `src/components/CombatantTracker/CombatantList.jsx` | Modify | Wrap with DndContext |
| `src/context/DiceContext.jsx` | Modify | Add reorderSavedRolls, reorderCombatants |
| `src/App.jsx` | Modify | Wire up reorder callbacks |

---

## Testing Checklist

- [ ] Drag saved roll cards between positions, verify order persists
- [ ] Drag combatant cards between positions, verify order persists
- [ ] Drag handle works on desktop mouse
- [ ] Drag handle works on touch devices (mobile/tablet)
- [ ] Tapping buttons inside cards does not trigger drag
- [ ] Editing text fields does not trigger drag
- [ ] Keyboard reordering works (arrow keys)
- [ ] Dragging over 2-column grid works correctly
- [ ] localStorage persistence after reorder
- [ ] Reorder survives page refresh
- [ ] No console errors or warnings

---

## Alternative: Simplified Approach

If the full drag-and-drop implementation is deemed too complex, a fallback is adding up/down arrow buttons to each card:

```jsx
<button onClick={() => onMove(roll.id, -1)} title="Move up">↑</button>
<button onClick={() => onMove(roll.id, 1)} title="Move down">↓</button>
```

This requires only:
1. `moveItem(id, direction)` in DiceContext
2. Two buttons per card
3. ~50 lines total

However, this lacks the intuitive UX of drag-and-drop and is less efficient for large reordering tasks.