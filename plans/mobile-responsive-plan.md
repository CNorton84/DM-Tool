# Mobile Responsive Layout Plan

## Overview

This plan introduces three responsive layout modes to the DM Util App, scaling elements down for smaller screens and switching to a full-screen tabbed panel mode on narrow portrait devices.

## Current State Analysis

### Current Layout (App.jsx)
- Three-column flex layout: left sidebar | center | right sidebar
- Left sidebar: `flex-1 min-w-[320px] max-w-[512px]`
- Center section: `flex-1 min-w-[320px] max-w-[512px] w-80 lg:w-96`
- Right sidebar: `flex-1 min-w-[320px] max-w-[512px]`
- Toggle buttons already exist but only work on `lg:` breakpoint
- Current `min-w-[320px]` per panel means ~960px minimum total width

### Problem
- On mobile portrait (e.g., 375x812 iPhone SE), three columns at 320px minimum is impossible
- Elements (buttons, inputs, cards) are sized for desktop with large padding and fonts
- No responsive scaling exists anywhere in the app

## Proposed Solution: Three Layout Modes

### Layout Mode Definitions

| Mode | Breakpoint | Layout | Description |
|------|-----------|--------|-------------|
| Desktop | `lg:` (1024px+) | Three-column side-by-side | Current behavior, unchanged |
| Tablet | `md:` to `lg:` (768-1023px) | Two-column with tabs | Side panels share one column via tabs |
| Mobile | `<md:` (< 768px) | Full-screen panels | One panel at a time, tab navigation |

### Aspect Ratio Detection

In addition to viewport width, we detect narrow aspect ratios (portrait mobile) using a custom hook that checks `window.innerWidth / window.innerHeight < 0.65`. This ensures devices held portrait get the full-screen panel treatment even if they have wide screens (e.g., tablets in portrait).

## Architecture

### New Hook: `useMobileLayout`

**File:** `src/hooks/useMobileLayout.js`

```js
import { useState, useCallback, useEffect } from 'react';

export function useMobileLayout() {
  const [mode, setMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [activePanel, setActivePanel] = useState('savedRolls'); // 'savedRolls' | 'combatants'

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      const aspectRatio = width / window.innerHeight;
      const isNarrow = aspectRatio < 0.65;

      if (width >= 1024 && !isNarrow) {
        setMode('desktop');
      } else if (width >= 768 || !isNarrow) {
        setMode('tablet');
      } else {
        setMode('mobile');
      }
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { mode, activePanel, setActivePanel };
}
```

### Updated App.jsx Layout Logic

| Mode | Left Panel | Center | Right Panel |
|------|-----------|--------|-------------|
| Desktop | Always visible | Always visible | Always visible |
| Tablet | Tabbed with right (shared column) | Always visible | Tabbed with left (shared column) |
| Mobile | Full screen when active | Full screen when active | Full screen when active |

#### Desktop Mode (`mode === 'desktop'`)
- Current layout, unchanged
- Both side panels always visible
- Toggle buttons hidden (`hidden lg:flex`)

#### Tablet Mode (`mode === 'tablet'`)
- Left and right panels share one column via tabs
- Center panel takes full width
- Tab bar at top of panel area switches between Saved Rolls and Combatants

```
+------------------+------------------+
| [SR] [Combat]    |  Dice Roller     |
+------------------+------------------+
|                  |                  |
|  (active panel)  |                  |
|                  |                  |
+------------------+------------------+
```

#### Mobile Mode (`mode === 'mobile'`)
- One panel takes the full screen at a time
- Tab bar at top switches between Dice Roller, Saved Rolls, Combatants
- Active panel fills the entire viewport area

```
+------------------+
| [Dice] [SR] [C]  |
+------------------+
|                  |
|  (active panel)  |
|                  |
+------------------+
```

## Component Changes

### 1. [`App.jsx`](src/App.jsx) - Layout Restructure

**Changes:**
- Import and use `useMobileLayout` hook
- Replace current three-column layout with mode-specific rendering
- Add mobile tab bar component inline
- Manage `activePanel` state for tablet/mobile modes

```jsx
// New imports
import { useMobileLayout } from './hooks/useMobileLayout';

// New state
const { mode, activePanel, setActivePanel } = useMobileLayout();

// Desktop layout (unchanged structure, wrapped in lg:block)
<div className="hidden lg:flex">
  {/* Current three-column layout */}
</div>

// Tablet layout
{mode === 'tablet' && (
  <div className="flex lg:hidden h-[calc(100vh-20px)] gap-2 w-full p-2">
    {/* Tab bar */}
    <div className="flex gap-1 mb-2">
      <button onClick={() => setActivePanel('savedRolls')} className={...}>Saved Rolls</button>
      <button onClick={() => setActivePanel('combatants')} className={...}>Combatants</button>
    </div>
    {/* Panel area */}
    <div className="w-80 border-r border-[#cd7f32] border-opacity-50 p-2 overflow-y-auto">
      <Panel title={activePanel === 'savedRolls' ? 'Saved Rolls' : 'Combatants'}>
        {activePanel === 'savedRolls' ? <SavedRollsPanel ... /> : <CombatantTracker ... />}
      </Panel>
    </div>
    {/* Center */}
    <section className="flex-1 p-2 overflow-y-auto">
      <Panel title="Dice Roller">
        <DiceRoller ... />
      </Panel>
    </section>
  </div>
)}

// Mobile layout
{mode === 'mobile' && (
  <div className="flex lg:hidden h-[calc(100vh-20px)] flex-col w-full p-2">
    {/* Tab bar */}
    <div className="flex gap-1 mb-2">
      <button onClick={() => setActivePanel('dice')} className={activePanel === 'dice' ? 'active' : ''}>Dice</button>
      <button onClick={() => setActivePanel('savedRolls')} className={activePanel === 'savedRolls' ? 'active' : ''}>Saved</button>
      <button onClick={() => setActivePanel('combatants')} className={activePanel === 'combatants' ? 'active' : ''}>Combat</button>
    </div>
    {/* Full-screen panel */}
    <div className="flex-1 overflow-y-auto">
      {activePanel === 'dice' && (
        <Panel title="Dice Roller"><DiceRoller ... /></Panel>
      )}
      {activePanel === 'savedRolls' && (
        <Panel title="Saved Rolls">
          <SavedRollsPanel ... />
        </Panel>
      )}
      {activePanel === 'combatants' && (
        <Panel title="Combatants">
          <CombatantTracker ... />
        </Panel>
      )}
    </div>
  </div>
)}
```

### 2. [`Panel.jsx`](src/components/UI/Panel.jsx) - Responsive Sizing

**Changes:**
- Add responsive padding and title size based on breakpoints

```jsx
// BEFORE:
<div className="bg-[#1a1a1a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2">
  <h2 className="text-[#cd7f32] font-bold text-sm mb-2 border-b border-[#cd7f32] pb-1">
    {title}
  </h2>
</div>

// AFTER:
<div className="bg-[#1a1a1a] border border-[#cd7f32] border-opacity-50 rounded-lg p-2 sm:p-2 md:p-2 lg:p-2">
  <h2 className="text-[#cd7f32] font-bold text-xs sm:text-sm mb-2 border-b border-[#cd7f32] pb-1">
    {title}
  </h2>
</div>
```

### 3. [`RollInput.jsx`](src/components/DiceRoller/RollInput.jsx) - Compact Mobile

**Changes:**
- Reduce input padding and font size on mobile
- Stack input/button vertically on very small screens

```jsx
// Input:
className="flex-1 min-w-0 bg-[#0a0a0a] border border-[#cd7f32] rounded px-3 py-2 
           sm:px-5 sm:py-3 
           text-[#e0e0e0] text-base sm:text-lg font-mono font-bold
           focus:outline-none focus:ring-2 focus:ring-[#9333ea]"

// Button:
className="shrink px-5 py-2 sm:px-8 sm:py-3 
           bg-[#cd7f32] text-[#0a0a0a] font-bold rounded
           hover:bg-[#b86d2a] text-sm sm:text-base"

// Form wrapper:
<form onSubmit={handleSubmit} className="mb-4 sm:mb-6">
  <div className="flex gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
```

### 4. [`RollResult.jsx`](src/components/DiceRoller/RollResult.jsx) - Compact Mobile

**Changes:**
- Reduce total number font size on mobile
- Compact card padding

```jsx
// Card:
className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-1.5 sm:p-2 mb-1.5 sm:mb-2"

// Total number:
<span style={getTotalColor()} className="text-[24px] sm:text-[36px] font-bold">

// Action buttons:
className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-[#666] ..."

// Formula text:
<span className="text-[#cd7f32] font-bold text-xs sm:text-sm">
```

### 5. [`CombatantCard.jsx`](src/components/CombatantTracker/CombatantCard.jsx) - Compact Mobile

**Changes:**
- Reduce card padding on mobile
- Smaller inputs and buttons
- Compact HP bar

```jsx
// Card wrapper:
className="bg-[#1a1a1a] border rounded-lg p-1.5 sm:p-2 mb-0"

// Input fields:
className="bg-[#0a0a0a] border border-[#cd7f32] rounded px-2 py-1 
           text-xs sm:text-sm"

// Buttons:
className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm"
```

### 6. [`SavedRollItem.jsx`](src/components/SavedRolls/SavedRollItem.jsx) - Compact Mobile

**Changes:**
- Reduce card padding
- Smaller buttons and text

```jsx
// Card:
className="bg-[#0a0a0a] border border-[#cd7f32] border-opacity-50 rounded-lg p-1.5 sm:p-2"

// Label:
<h3 className="text-[#cd7f32] font-bold text-xs sm:text-base">

// Command text:
<span className="text-[#666] text-xs sm:text-sm">

// Action buttons:
className="w-5 h-5 sm:w-6 sm:h-6 rounded border ..."
```

### 7. [`Button.jsx`](src/components/UI/Button.jsx) - Responsive Sizing

**Changes:**
- Add responsive padding

```jsx
// BEFORE:
const baseStyles = 'px-4 py-2 font-bold transition-colors duration-200';

// AFTER:
const baseStyles = 'px-3 py-1.5 sm:px-4 sm:py-2 font-bold transition-colors duration-200 text-xs sm:text-sm';
```

### 8. [`CombatantList.jsx`](src/components/CombatantTracker/CombatantList.jsx) - Grid Update

**Changes:**
- Already has `lg:grid-cols-2`, add responsive gap

```jsx
// BEFORE:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">

// AFTER (no change needed - already responsive):
<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
```

### 9. [`SavedRollsPanel.jsx`](src/components/SavedRolls/SavedRollsPanel.jsx) - Grid Update

**Changes:**
- Already has `lg:grid-cols-2`, adjust gap for mobile

```jsx
// No change needed - already responsive
<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
```

## Tab Bar Component

A simple inline tab bar will be used in both tablet and mobile modes. No separate component needed - it will be rendered inline in `App.jsx`.

**Tab bar styles:**
```jsx
<button
  onClick={() => setActivePanel('panelName')}
  className={`px-3 py-1.5 text-xs font-bold rounded transition-all duration-200 ${
    activePanel === 'panelName'
      ? 'bg-[#cd7f32] text-[#0a0a0a]'
      : 'bg-[#1a1a1a] text-[#cd7f32] border border-[#cd7f32] border-opacity-50'
  }`}
>
  Tab Label
</button>
```

## File Change Summary

| File | Change Type | Description |
|------|-------------|-------------|
| `src/hooks/useMobileLayout.js` | **New** | Custom hook for responsive layout detection |
| `src/App.jsx` | **Modify** | Three layout modes, tab navigation, active panel state |
| `src/components/UI/Panel.jsx` | **Modify** | Responsive title sizing |
| `src/components/UI/Button.jsx` | **Modify** | Responsive padding and font size |
| `src/components/DiceRoller/RollInput.jsx` | **Modify** | Compact mobile input/button sizing |
| `src/components/DiceRoller/RollResult.jsx` | **Modify** | Compact mobile result display |
| `src/components/CombatantTracker/CombatantCard.jsx` | **Modify** | Compact mobile card sizing |
| `src/components/CombatantTracker/CombatantList.jsx` | **Modify** | Responsive grid gap |
| `src/components/SavedRolls/SavedRollItem.jsx` | **Modify** | Compact mobile item sizing |
| `src/components/SavedRolls/SavedRollsPanel.jsx` | **No Change** | Already responsive |

## Visual Breakpoint Diagram

```
Width >= 1024px (Desktop)       768px <= Width < 1024px (Tablet)     Width < 768px (Mobile)
+-----------+--------+         +-----------+--------+               +-----------------+
|           |        |         | [SR][Combat]       |               | [Dice][SR][Combat]|
| Saved     |  Dice  |         |                   |               +-----------------+
| Rolls     | Roller |         |   Saved Rolls     |               |                 |
|           |        |         |                   |               |   Dice Roller   |
|           |        |         +-----------+       |               |                 |
+-----------+--------+         |   Dice    |       |               |                 |
+-----------+--------+         +-----------+       |               +-----------------+
| Combatants|        |                              
|           | Roller |         Tablet: side panels   Mobile: full-screen
|           |        |         share one column      tabbed panels
+-----------+--------+         
```

## Implementation Order

1. Create `useMobileLayout` hook
2. Update `App.jsx` with three layout modes
3. Update `Panel.jsx` with responsive sizing
4. Update `Button.jsx` with responsive sizing
5. Update `RollInput.jsx` for compact mobile
6. Update `RollResult.jsx` for compact mobile
7. Update `CombatantCard.jsx` for compact mobile
8. Update `SavedRollItem.jsx` for compact mobile
9. Update `CombatantList.jsx` grid gap
10. Test responsive behavior across breakpoints