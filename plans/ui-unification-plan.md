# UI Unification Plan

## Task 1: Unify Reroll Button Styling

### Current State
- **RollResult.jsx** (line 53-58): Reroll button uses gray styling (`border-[#666] text-[#666]`)
- **SavedRollItem.jsx** (line 88-93): Reroll button uses gold/bronze styling (`border-[#cd7f32] text-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a]`)

### Change
Update [`RollResult.jsx`](src/components/DiceRoller/RollResult.jsx:53-58) reroll button className to match SavedRollItem:

```jsx
// BEFORE (line 55)
className="w-8 h-8 rounded border border-[#666] text-[#666] hover:bg-[#cd7f32] hover:text-[#0a0a0a] hover:border-[#cd7f32] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"

// AFTER
className="w-8 h-8 sm:w-6 sm:h-6 rounded border border-[#cd7f32] text-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a] transition-all duration-200 font-mono text-xs sm:text-sm flex items-center justify-center"
```

This also adds the responsive sizing (`sm:w-6 sm:h-6`) to match SavedRollItem.

---

## Task 2: Replace Trash Can with X Icon in Saved Rolls

### Current State
- **SavedRollItem.jsx** (line 94-99): Delete button uses trash can emoji (🗑)
- **CombatantCard.jsx** (line 237-243): Delete button uses X symbol (✕)

### Change
Update [`SavedRollItem.jsx`](src/components/SavedRolls/SavedRollItem.jsx:94-99) delete button icon:

```jsx
// BEFORE (line 98)
🗑

// AFTER
✕
```

---

## Task 3: Replace Paste Emoji with Copy Icon in Combatant Cards

### Current State
- **CombatantCard.jsx** (line 230-235): Duplicate button uses paste emoji (📋)

### Change
Update [`CombatantCard.jsx`](src/components/CombatantTracker/CombatantCard.jsx:230-235) duplicate button to use an SVG copy icon (two overlapping squares):

```jsx
// BEFORE (line 235)
📋

// AFTER
<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
  <rect x="4" y="4" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
  <rect x="1" y="1" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5"/>
</svg>
```

---

## Task 4: Simplify "No Rolls Yet" Message

### Current State
- **RollHistory.jsx** (line 6-12): Shows two lines with emoji

```jsx
<p className="text-xl font-bold mb-2">🎲 No rolls yet</p>
<p className="text-base">Make a roll to get started!</p>
```

### Change
Update [`RollHistory.jsx`](src/components/DiceRoller/RollHistory.jsx:6-12) to a single line:

```jsx
<p className="text-[#888] text-center text-base font-bold">No rolls yet</p>
```

---

## Task 5: Reorder Mobile/Tablet Tabs

### Current State
The mobile and tablet tab order is: [Dice], [Saved], [Combat]

**Mobile tabs** - [`App.jsx`](src/App.jsx:161-171):
```jsx
<TabButton active={activePanel === 'dice'}>Dice</TabButton>
<TabButton active={activePanel === 'savedRolls'}>Saved</TabButton>
<TabButton active={activePanel === 'combatants'}>Combat</TabButton>
```

**Tablet tabs** - [`App.jsx`](src/App.jsx:102-109):
```jsx
<TabButton active={activePanel === 'savedRolls'}>Saved Rolls</TabButton>
<TabButton active={activePanel === 'combatants'}>Combatants</TabButton>
```

**Swipe order** - [`useMobileLayout.js`](src/hooks/useMobileLayout.js:31):
```js
const mobilePanels = ['dice', 'savedRolls', 'combatants'];
```

### Desired State
New order: [Saved Rolls], [Dice Roller], [Combatants]

**Mobile tabs** (update labels and order):
```jsx
<TabButton active={activePanel === 'savedRolls'}>Saved Rolls</TabButton>
<TabButton active={activePanel === 'dice'}>Dice Roller</TabButton>
<TabButton active={activePanel === 'combatants'}>Combatants</TabButton>
```

**Tablet tabs** — no change needed. The tablet view keeps its current two-tab layout (Saved Rolls / Combatants) since Dice Roller is always visible on the right.

**Swipe order** - update [`useMobileLayout.js`](src/hooks/useMobileLayout.js:31):
```js
const mobilePanels = ['savedRolls', 'dice', 'combatants'];
```

---

## File Summary

| File | Changes |
|------|---------|
| [`src/components/DiceRoller/RollResult.jsx`](src/components/DiceRoller/RollResult.jsx:55) | Update reroll button styling |
| [`src/components/SavedRolls/SavedRollItem.jsx`](src/components/SavedRolls/SavedRollItem.jsx:98) | Replace trash emoji with X |
| [`src/components/CombatantTracker/CombatantCard.jsx`](src/components/CombatantTracker/CombatantCard.jsx:235) | Replace paste emoji with copy SVG |
| [`src/components/DiceRoller/RollHistory.jsx`](src/components/DiceRoller/RollHistory.jsx:8-10) | Simplify empty message |
| [`src/App.jsx`](src/App.jsx:102-109,161-171) | Reorder tabs, update labels, add dice tab to tablet |
| [`src/hooks/useMobileLayout.js`](src/hooks/useMobileLayout.js:31) | Update swipe order array |