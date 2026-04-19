# Two-Column Layout Plan for Saved Rolls and Combatant Panels

## Overview

This plan describes the implementation changes to make the Saved Rolls and Combatant panels twice as wide and display items in a two-column grid layout instead of a single column.

## Current State

### Layout Structure (App.jsx)
- Left sidebar: `w-64 lg:w-72` (16rem/18rem = ~256px/288px)
- Right sidebar: `w-64 lg:w-72` (16rem/18rem = ~256px/288px)
- Both panels use a single-column vertical layout (`space-y-*` classes)

### Components Affected
| Component | Current Layout | Change |
|-----------|---------------|--------|
| [`SavedRollsPanel`](src/components/SavedRolls/SavedRollsPanel.jsx) | Single column (`space-y-4`) | Two-column grid |
| [`CombatantList`](src/components/CombatantTracker/CombatantList.jsx) | Single column (`space-y-2`) | Two-column grid |
| [`App.jsx`](src/App.jsx) | Sidebar width `w-64 lg:w-72` | Double width |

## Implementation Changes

### 1. Update Sidebar Widths in [`App.jsx`](src/App.jsx)

Change the sidebar width classes from `w-64 lg:w-72` to `w-80 lg:w-96` (20rem/24rem = ~320px/384px), effectively doubling the width.

**Line 35-37 (Left Sidebar):**
```jsx
// BEFORE:
className={`${leftPanelOpen ? 'w-64 lg:w-72' : 'w-0 opacity-0 pointer-events-none'} ...`}

// AFTER:
className={`${leftPanelOpen ? 'w-80 lg:w-96' : 'w-0 opacity-0 pointer-events-none'} ...`}
```

**Line 62-64 (Right Sidebar):**
```jsx
// BEFORE:
className={`${rightPanelOpen ? 'w-64 lg:w-72' : 'w-0 opacity-0 pointer-events-none'} ...`}

// AFTER:
className={`${rightPanelOpen ? 'w-80 lg:w-96' : 'w-0 opacity-0 pointer-events-none'} ...`}
```

### 2. Update [`SavedRollsPanel`](src/components/SavedRolls/SavedRollsPanel.jsx) to Two-Column Grid

**Line 31-42:**
```jsx
// BEFORE:
<div>
  <div className="space-y-4">
    {savedRolls.map((roll) => (
      <SavedRollItem key={roll.id} ... />
    ))}
  </div>
  ...
</div>

// AFTER:
<div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
    {savedRolls.map((roll) => (
      <SavedRollItem key={roll.id} ... />
    ))}
  </div>
  ...
</div>
```

### 3. Update [`CombatantList`](src/components/CombatantTracker/CombatantList.jsx) to Two-Column Grid

**Line 16-28:**
```jsx
// BEFORE:
<div className="space-y-2">
  {combatants.map((combatant) => (
    <CombatantCard key={combatant.id} ... />
  ))}
</div>

// AFTER:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
  {combatants.map((combatant) => (
    <CombatantCard key={combatant.id} ... />
  ))}
</div>
```

### 4. Adjust [`SavedRollItem`](src/components/SavedRolls/SavedRollItem.jsx) Styling

The saved roll item cards may need minor padding/font adjustments to fit well in a narrower column. Consider:

**Line 7:**
```jsx
// BEFORE:
className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2 mb-2 ..."

// AFTER:
className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2 ..."
```
- Remove `mb-2` since grid gap handles spacing

### 5. Adjust [`CombatantCard`](src/components/CombatantTracker/CombatantCard.jsx) Styling

**Line 98:**
```jsx
// BEFORE:
className={`bg-[#1a1a1a] border rounded-lg p-3 mb-2 ...`

// AFTER:
className={`bg-[#1a1a1a] border rounded-lg p-2 mb-0 ...`
```
- Reduce padding from `p-3` to `p-2` for tighter fit
- Remove `mb-2` since grid gap handles spacing

## Visual Layout Diagram

```
BEFORE (single column, ~256px wide):
┌──────────────────────┐
│  Saved Rolls Panel   │
├──────────────────────┤
│  Roll Item 1         │
├──────────────────────┤
│  Roll Item 2         │
├──────────────────────┤
│  Roll Item 3         │
└──────────────────────┘

AFTER (two columns, ~512px wide):
┌────────────────────────────────────────┐
│  Saved Rolls Panel                     │
├────────────────────────────────────────┤
│  Roll 1        │  Roll 2               │
├────────────────┼───────────────────────┤
│  Roll 3        │  Roll 4               │
├────────────────┼───────────────────────┤
│  Roll 5        │  Roll 6               │
└────────────────┴───────────────────────┘
```

## Responsive Considerations

- **Mobile (small screens)**: Panels are collapsible. Use single-column layout with `grid-cols-1 lg:grid-cols-2`.
- **Desktop (lg breakpoint and above)**: Use two-column layout to take advantage of the doubled panel width.
- This ensures items are readable on mobile while maximizing space on desktop.

## Files to Modify

| File | Change Type | Lines |
|------|-------------|-------|
| [`src/App.jsx`](src/App.jsx) | Width class update | 36, 63 |
| [`src/components/SavedRolls/SavedRollsPanel.jsx`](src/components/SavedRolls/SavedRollsPanel.jsx) | Grid layout | 32 |
| [`src/components/CombatantTracker/CombatantList.jsx`](src/components/CombatantTracker/CombatantList.jsx) | Grid layout | 17 |
| [`src/components/SavedRolls/SavedRollItem.jsx`](src/components/SavedRolls/SavedRollItem.jsx) | Spacing adjustment | 7 |
| [`src/components/CombatantTracker/CombatantCard.jsx`](src/components/CombatantTracker/CombatantCard.jsx) | Padding/spacing adjustment | 98 |

## Implementation Order

1. Update sidebar widths in `App.jsx`
2. Update `SavedRollsPanel` to use grid layout
3. Update `CombatantList` to use grid layout
4. Adjust `SavedRollItem` spacing
5. Adjust `CombatantCard` padding/spacing
6. Test responsive behavior

## Risks and Considerations

1. **CombatantCard complexity**: The CombatantCard component is relatively tall (HP bars, damage inputs, description textarea). In a two-column layout, this is acceptable since cards stack vertically within columns.
2. **SavedRollItem text overflow**: With narrower cards, long labels/commands may wrap. The existing `overflow-hidden` and `title` attributes handle this.
3. **Mobile experience**: On small screens where panels collapse, the doubled width may not provide benefit. Consider keeping single column on mobile.
