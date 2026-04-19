# DM Util - Dice Roller & Combat Tracker

A React + Vite dice roller application designed for tabletop RPG players. Features dice rolling with history, saved rolls, and a combatant tracker.

## Features

- **Dice Rolling**: Support for complex dice commands (e.g., `2d6+5`, `1d20-2`, `2d6+1d4+3`)
- **Roll History**: Track your recent dice rolls
- **Saved Rolls**: Save favorite rolls for quick access
- **Combatant Tracker**: Manage combatants during combat encounters
- **Responsive Design**: Works on desktop and mobile devices

## Dice Command Syntax

The app uses a flexible dice command format:

```
[count]d[faces][+/-modifier]
```

### Examples

| Command | Description |
|---------|-------------|
| `1d20` | Single 20-sided die roll |
| `2d6+5` | Two 6-sided dice plus 5 |
| `1d20-2` | One 20-sided die minus 2 |
| `4d6` | Four 6-sided dice |
| `2d6+1d4+3` | Multiple dice groups with modifiers |

### Rules

- Minimum die faces: 2
- Maximum die faces: 10,000
- Maximum command length: 100 characters
- Supports multiple dice groups in a single command

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173/DM-Tool/`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **PropTypes** - Type checking
- **React Context API** - State management

## Project Structure

```
src/
  components/
    UI/              # Reusable UI components
    DiceRoller/      # Dice rolling feature
    SavedRolls/      # Saved rolls feature
    CombatantTracker/ # Combat management
  context/           # React Context providers
  hooks/             # Custom React hooks
  utils/             # Utility functions
  constants.js       # App-wide constants
```

## Deployment

This app is configured for deployment on GitHub Pages.

```bash
npm run deploy
```

## License

MIT
