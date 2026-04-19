import { useState } from 'react';
import { DiceRoller } from './components/DiceRoller/DiceRoller';
import { SavedRollsPanel } from './components/SavedRolls/SavedRollsPanel';
import { CombatantTracker } from './components/CombatantTracker/CombatantTracker';
import { Panel } from './components/UI/Panel';
import { DiceProvider, useDiceContext } from './context/DiceContext';
import { useMobileLayout } from './hooks/useMobileLayout';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded transition-all duration-200 ${
      active
        ? 'bg-[#cd7f32] text-[#0a0a0a]'
        : 'bg-[#1a1a1a] text-[#cd7f32] border border-[#cd7f32] border-opacity-50'
    }`}
  >
    {children}
  </button>
);

function AppContent() {
  const { rollHistory, savedRolls, combatants, handleRoll, saveRoll, updateSavedRoll, removeSavedRoll, addCombatant, removeCombatant, updateCombatant, duplicateCombatant, applyDamage } = useDiceContext();
  const { mode, activePanel, setActivePanel, touchHandlers } = useMobileLayout();

  const handleRollSubmit = (command) => {
    const result = handleRoll(command);
    return result;
  };

  const handleSaveRoll = (roll) => {
    saveRoll(roll);
  };

  // Desktop layout (>= 1024px, wide aspect)
  if (mode === 'desktop') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden">
        <main className="flex h-[calc(100vh-20px)] gap-2 relative w-full justify-center">
          {/* Left Sidebar */}
          <aside className="flex-1 min-w-[320px] max-w-[512px] border-r border-[#cd7f32] border-opacity-50 p-2 overflow-y-auto">
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
          <section className="flex-1 min-w-[320px] max-w-[512px] p-2 overflow-y-auto flex-shrink-0">
            <Panel title="Dice Roller">
              <DiceRoller
                onRoll={handleRollSubmit}
                history={rollHistory}
                onSave={handleSaveRoll}
              />
            </Panel>
          </section>

          {/* Right Sidebar */}
          <aside className="flex-1 min-w-[320px] max-w-[512px] border-l border-[#cd7f32] border-opacity-50 p-2 overflow-y-auto">
            <Panel title="Combatants">
              <CombatantTracker
                combatants={combatants}
                onAddCombatant={addCombatant}
                onRemoveCombatant={removeCombatant}
                onUpdateCombatant={updateCombatant}
                onDuplicateCombatant={duplicateCombatant}
                onApplyDamage={applyDamage}
              />
            </Panel>
          </aside>
        </main>
      </div>
    );
  }

  // Tablet layout (768-1023px or wide aspect on smaller devices)
  if (mode === 'tablet') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden">
        <main className="flex h-[calc(100vh-20px)] gap-2 w-full p-2">
          {/* Left Column: Side Panels with Tabs */}
          <div className="w-72 sm:w-80 flex flex-col">
            <div className="flex gap-1 mb-2">
              <TabButton active={activePanel === 'savedRolls'} onClick={() => setActivePanel('savedRolls')}>
                Saved Rolls
              </TabButton>
              <TabButton active={activePanel === 'combatants'} onClick={() => setActivePanel('combatants')}>
                Combatants
              </TabButton>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activePanel === 'savedRolls' ? (
                <Panel title="Saved Rolls">
                  <SavedRollsPanel
                    savedRolls={savedRolls}
                    onRoll={handleRollSubmit}
                    onUpdate={updateSavedRoll}
                    onDelete={removeSavedRoll}
                  />
                </Panel>
              ) : (
                <Panel title="Combatants">
                  <CombatantTracker
                    combatants={combatants}
                    onAddCombatant={addCombatant}
                    onRemoveCombatant={removeCombatant}
                    onUpdateCombatant={updateCombatant}
                    onDuplicateCombatant={duplicateCombatant}
                    onApplyDamage={applyDamage}
                  />
                </Panel>
              )}
            </div>
          </div>

          {/* Right Column: Dice Roller */}
          <section className="flex-1 overflow-y-auto">
            <Panel title="Dice Roller">
              <DiceRoller
                onRoll={handleRollSubmit}
                history={rollHistory}
                onSave={handleSaveRoll}
              />
            </Panel>
          </section>
        </main>
      </div>
    );
  }

  // Mobile layout (< 768px, narrow aspect)
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-mono overflow-hidden"
      onTouchStart={touchHandlers.onTouchStart}
      onTouchEnd={touchHandlers.onTouchEnd}
    >
      <main className="flex h-[calc(100vh-20px)] flex-col gap-2 w-full p-2">
        {/* Tab Bar */}
        <div className="flex gap-1">
          <TabButton active={activePanel === 'dice'} onClick={() => setActivePanel('dice')}>
            Dice
          </TabButton>
          <TabButton active={activePanel === 'savedRolls'} onClick={() => setActivePanel('savedRolls')}>
            Saved
          </TabButton>
          <TabButton active={activePanel === 'combatants'} onClick={() => setActivePanel('combatants')}>
            Combat
          </TabButton>
        </div>

        {/* Full-screen Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {activePanel === 'dice' && (
            <Panel title="Dice Roller">
              <DiceRoller
                onRoll={handleRollSubmit}
                history={rollHistory}
                onSave={handleSaveRoll}
              />
            </Panel>
          )}
          {activePanel === 'savedRolls' && (
            <Panel title="Saved Rolls">
              <SavedRollsPanel
                savedRolls={savedRolls}
                onRoll={handleRollSubmit}
                onUpdate={updateSavedRoll}
                onDelete={removeSavedRoll}
              />
            </Panel>
          )}
          {activePanel === 'combatants' && (
            <Panel title="Combatants">
              <CombatantTracker
                combatants={combatants}
                onAddCombatant={addCombatant}
                onRemoveCombatant={removeCombatant}
                onUpdateCombatant={updateCombatant}
                onDuplicateCombatant={duplicateCombatant}
                onApplyDamage={applyDamage}
              />
            </Panel>
          )}
        </div>
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
