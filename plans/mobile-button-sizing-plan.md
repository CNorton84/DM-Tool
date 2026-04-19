# Mobile Button Sizing Plan

## Overview
Improve mobile experience by increasing button sizes across all three panels, limited to mobile views only. Desktop layouts remain unchanged.

## Current Button Sizes (Mobile)

| Component | Button | Current Size |
|-----------|--------|-------------|
| **Button.jsx** (shared) | Primary/Secondary/Danger | `px-3 py-1.5` (12px x 6px) |
| **RollInput.jsx** | Roll button | `px-4 py-1.5` (16px x 6px) |
| **CombatantCard.jsx** | DM Apply (uses Button.jsx) | `px-3 py-1.5` (12px x 6px) |
| **CombatantCard.jsx** | IconButton (duplicate, close) | `p-2` (8px padding) |
| **RollResult.jsx** | Roll Again, Save | `w-4 h-4` (16px x 16px) |
| **SavedRollItem.jsx** | Roll, Edit, Delete | `w-5 h-5` (20px x 20px) |

## Target Button Size

- **Base target**: Increase combatant panel buttons by ~50%
- **New standard size**: `px-4 py-2` (16px x 8px) for regular buttons, `w-8 h-8` (32px x 32px) for icon buttons
- **Scope**: Mobile only (below `sm:` breakpoint, i.e., < 640px)
- **Desktop**: All `sm:` prefixes remain unchanged

## Implementation Steps

### Step 1: Update Button.jsx
**File**: [`src/components/UI/Button.jsx`](src/components/UI/Button.jsx:4)

Change base styles from:
```
px-3 py-1.5 sm:px-4 sm:py-2
```
To:
```
px-4 py-2 sm:px-4 sm:py-2
```

This makes mobile buttons 33% wider and 33% taller, matching the current desktop sizes.

### Step 2: Update RollInput.jsx
**File**: [`src/components/DiceRoller/RollInput.jsx`](src/components/DiceRoller/RollInput.jsx:35)

Change Roll button from:
```
px-4 py-1.5 sm:px-8 sm:py-3
```
To:
```
px-4 py-2 sm:px-8 sm:py-3
```

Aligns mobile height with new Button.jsx standard.

### Step 3: Update IconButton.jsx
**File**: [`src/components/UI/IconButton.jsx`](src/components/UI/IconButton.jsx:14)

Change padding from:
```
p-2
```
To:
```
p-2.5 sm:p-2
```

Increases mobile icon buttons from 16px to 28px total touch target.

### Step 4: Update RollResult.jsx - Side-by-Side Button Layout
**File**: [`src/components/DiceRoller/RollResult.jsx`](src/components/DiceRoller/RollResult.jsx:52)

**Current layout**: Buttons stacked vertically (`flex-col`)
```jsx
<div className="flex flex-col gap-0.5 sm:gap-1">
```

**New layout**: Buttons side-by-side on mobile
```jsx
<div className="flex gap-0.5 sm:gap-1 flex-row">
```

Also update button sizes from:
```
w-4 h-4 sm:w-5 sm:h-5
```
To:
```
w-8 h-8 sm:w-5 sm:h-5
```

This changes mobile icon buttons from 16px to 32px, and side-by-side layout prevents excessive card height.

### Step 5: Update SavedRollItem.jsx
**File**: [`src/components/SavedRolls/SavedRollItem.jsx`](src/components/SavedRolls/SavedRollItem.jsx:19-33)

Update button sizes from:
```
w-5 h-5 sm:w-6 sm:h-6
```
To:
```
w-8 h-8 sm:w-6 sm:h-6
```

Changes mobile buttons from 20px to 32px, matching the new standard.

### Step 6: Add Swipe Detection to useMobileLayout.js
**File**: [`src/hooks/useMobileLayout.js`](src/hooks/useMobileLayout.js)

Add swipe gesture detection for tab switching on mobile:
- Track `touchstart` and `touchend` coordinates
- Calculate horizontal swipe distance
- Minimum swipe threshold of 50px to avoid accidental triggers
- Return `onSwipeLeft` and `onSwipeRight` callbacks from the hook

```js
// New additions to useMobileLayout
const SWIPE_THRESHOLD = 50;
const [touchStart, setTouchStart] = useState(null);

const handleTouchStart = (e) => {
  setTouchStart(e.touches[0].clientX);
};

const handleTouchEnd = (e) => {
  if (!touchStart) return;
  const touchEnd = e.changedTouches[0].clientX;
  const diff = touchStart - touchEnd;
  
  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    if (diff > 0) {
      onSwipeLeft?.();  // Swipe left → next panel
    } else {
      onSwipeRight?.(); // Swipe right → previous panel
    }
  }
  setTouchStart(null);
};
```

### Step 7: Wire Up Swipe Gestures in App.jsx
**File**: [`src/App.jsx`](src/App.jsx)

In the tablet layout section, wrap the panel container with touch event handlers:
- Add `onTouchStart`, `onTouchMove`, `onTouchEnd` to the panel wrapper div
- Map swipe left → cycle to next panel (savedRolls → combatants)
- Map swipe right → cycle to previous panel (combatants → savedRolls)
- Update `activePanel` state using existing `setActivePanel`

## Visual Summary

```
Mobile Button Size Comparison
+---------------------------+----------------------------------+
| Before (Mobile)           |  After (Mobile)                  |
|                           |                                  |
| Button.jsx:  12x6px       |  Button.jsx:  16x8px  (+33%)    |
| RollInput:   16x6px       |  RollInput:   16x8px  (+33% ht) |
| IconButton:  16px total   |  IconButton:  28px total (+75%) |
| RollResult:  16x16px      |  RollResult:  32x32px (+100%)   |
| SavedRoll:   20x20px      |  SavedRoll:   32x32px (+60%)    |
|                           |                                  |
| Buttons stacked vertically| Buttons side-by-side            |
+---------------------------+----------------------------------+
```

## Files Modified

1. `src/components/UI/Button.jsx` - Base button sizing
2. `src/components/UI/IconButton.jsx` - Icon button sizing
3. `src/components/DiceRoller/RollInput.jsx` - Roll button height
4. `src/components/DiceRoller/RollResult.jsx` - Button size + layout change
5. `src/components/SavedRolls/SavedRollItem.jsx` - Button size increase

## Risk Assessment

- **Low risk**: All changes use existing Tailwind classes, no new dependencies
- **Layout impact**: Side-by-side buttons in RollResult will be wider but shorter; cards will fit better on narrow screens
- **Touch targets**: All buttons will meet or exceed 32px touch target recommendation for mobile
- **Desktop unaffected**: All `sm:` breakpoints preserve existing desktop appearance