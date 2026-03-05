import { useState } from 'react';
import { DiceRoller } from './components/DiceRoller/DiceRoller';
import { SavedRollsPanel } from './components/SavedRolls/SavedRollsPanel';
import { CombatantTracker } from './components/CombatantTracker/CombatantTracker';
import { Panel } from './components/UI/Panel';
import { DiceProvider, useDiceContext } from './context/DiceContext';

function AppContent() {
  const { rollHistory, savedRolls, handleRoll, saveRoll, updateSavedRoll, removeSavedRoll } = useDiceContext();
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const handleRollSubmit = (command) => {
    const result = handleRoll(command);
    return result;
  };

  const handleSaveRoll = (roll) => {
    saveRoll(roll);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden">
      <main className="flex h-[calc(100vh-20px)] gap-2 relative">
        {/* Left Toggle Button - Only visible on small screens */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="lg:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-12 bg-[#1a1a1a] border border-[#cd7f32] rounded-r-lg flex items-center justify-center text-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a] transition-all duration-300"
        >
          {leftPanelOpen ? '◀' : '▶'}
        </button>

        {/* Left Sidebar */}
        <aside
          className={`${
            leftPanelOpen ? 'w-64 lg:w-72' : 'w-0 opacity-0 pointer-events-none'
          } border-r border-[#cd7f32] border-opacity-50 p-2 overflow-y-auto transition-all duration-300 flex-shrink-0`}
        >
          <Panel title="Saved Rolls">
            <SavedRollsPanel
              savedRolls={savedRolls}
              onRoll={handleRollSubmit}
              onUpdate={updateSavedRoll}
              onDelete={removeSavedRoll}
            />
          </Panel>
        </aside>

        {/* Center Section */}
        <section className="flex-1 p-2 overflow-y-auto max-w-lg mx-auto w-full">
          <Panel title="Dice Roller">
            <DiceRoller
              onRoll={handleRollSubmit}
              history={rollHistory}
              onSave={handleSaveRoll}
            />
          </Panel>
        </section>

        {/* Right Sidebar */}
        <aside
          className={`${
            rightPanelOpen ? 'w-64 lg:w-72' : 'w-0 opacity-0 pointer-events-none'
          } border-l border-[#cd7f32] border-opacity-50 p-2 overflow-y-auto transition-all duration-300 flex-shrink-0`}
        >
          <Panel title="Combatants">
            <CombatantTracker />
          </Panel>
        </aside>

        {/* Right Toggle Button - Only visible on small screens */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-12 bg-[#1a1a1a] border border-[#cd7f32] rounded-l-lg flex items-center justify-center text-[#cd7f32] hover:bg-[#cd7f32] hover:text-[#0a0a0a] transition-all duration-300"
        >
          {rightPanelOpen ? '▶' : '◀'}
        </button>
      </main>
    </div>
  );
}

function App() {
  return (
    <DiceProvider>
      <AppContent />
    </DiceProvider>
  );
}

export default App;
