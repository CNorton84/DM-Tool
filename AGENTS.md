# DM Util App - Agent Guidelines

## Project Overview

React + Vite dice roller application for tabletop RPGs. Uses ES modules, PropTypes for type checking, and Tailwind CSS for styling.

## Commands

### Development
```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

### Testing
No test framework is configured. Manual testing via dev server is the primary approach.

## Code Style

### Imports
- Use named exports/imports for components and utilities
- Import React hooks first, then local modules, then external packages
- Relative imports use `./` for same directory, `../` for parent
```js
import { useState, useCallback } from 'react';
import { parseDiceCommand } from '../utils/diceParser';
import PropTypes from 'prop-types';
```

### Component Patterns
- Functional components with named exports: `export const ComponentName = () => {}`
- Use PropTypes for type validation (no TypeScript)
- Separate UI components from logic using custom hooks
- Context providers wrap content: `export const Provider = ({ children }) => {}`

### Custom Hooks
- Prefix with `use`: `useDiceParser`, `useSavedRolls`, `useRollHistory`
- Return objects with descriptive property names
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive computations

### State Management
- Use Context API for global state (DiceContext)
- Persist to localStorage with defensive parsing
- Limit collections with `splice()` to prevent memory growth
- Generate IDs with pattern: `${type}-${Date.now()}-${randomString}`

### Naming Conventions
- Components: PascalCase (`DiceRoller`, `SavedRollsPanel`)
- Files: PascalCase for components (`ComponentName.jsx`)
- Functions/hooks: camelCase (`handleRoll`, `useDiceParser`)
- Constants: UPPER_SNAKE_CASE (`MIN_DICE_FACES`, `TOKEN_TYPE`)
- Hooks return: descriptive camelCase objects

### Error Handling
- Return `{ error: { message, code, position, input } }` for validation errors
- Use `getErrorMessage()` for basic validation before parsing
- Log errors with `console.error()` and set state for UI display
- Defensive localStorage with try/catch blocks

### Styling
- Tailwind CSS with custom color palette:
  - Primary: `#cd7f32` (gold/bronze)
  - Background: `#0a0a0a` (near black)
  - Surface: `#1a1a1a` (dark gray)
  - Text: `#e0e0e0` (light gray)
- Use arbitrary values: `bg-[#cd7f32]`, `text-[#0a0a0a]`
- Font: `font-mono` throughout the app

### File Organization
```
src/
  components/
    UI/           # Reusable UI components
    DiceRoller/   # Feature components
    SavedRolls/   # Feature components
    CombatantTracker/
  context/        # React Context providers
  hooks/          # Custom hooks
  utils/          # Pure utility functions
  constants.js    # App-wide constants
```

### ESLint Rules
- Follows React Hooks rules of hooks
- Unused vars allowed if matching `^[A-Z_]` (constants, PropTypes)
- ES2020 with JSX support
- Flat config with `@eslint/js` recommended rules

### Utilities
- Export pure functions from `utils/` files
- No side effects in utility functions
- Return structured results with `valid` boolean when parsing
- Use constants for magic numbers and error codes

### Dice Command Format
- Syntax: `[count]d[faces][+/-modifier]` (e.g., `2d6+5`, `1d20-2`)
- Min faces: 2, Max faces: 10000
- Max command length: 100 characters
- Supports multiple dice groups: `2d6+1d4+3`
