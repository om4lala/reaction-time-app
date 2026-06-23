import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { GameState } from './types';
import { ReactionArea } from './components/ReactionArea';
import { StatsPanel } from './components/StatsPanel';

export default function App() {
  const [scores, setScores] = useLocalStorage<number[]>('reaction-scores', []);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAddScore = (score: number) => {
    setScores(prev => [...prev, score]);
  };

  const handleClearScores = () => {
    setShowConfirm(true);
  };

  const confirmClear = () => {
    setScores([]);
    setGameState('idle');
    setReactionTime(null);
    setShowConfirm(false);
  };

  const cancelClear = () => {
    setShowConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-slate-100 font-sans selection:bg-indigo-500/30">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              Reaction Time
            </h1>
            <p className="text-slate-400 mt-1">Test your visual reflexes.</p>
          </div>
        </header>

        {/* Responsive Grid Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative">
          
          {/* Main Interaction Area (takes up more space on desktop) */}
          <div className="lg:col-span-2 flex flex-col min-h-[400px]">
            <ReactionArea 
              gameState={gameState} 
              reactionTime={reactionTime}
              setGameState={setGameState}
              setReactionTime={setReactionTime}
              addScore={handleAddScore}
            />
          </div>

          {/* Stats Panel (sidebar on desktop, bottom on mobile) */}
          <div className="lg:col-span-1 h-full max-h-full">
            <StatsPanel 
              scores={scores} 
              onClear={handleClearScores} 
            />
          </div>

        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold text-white mb-2">Clear History?</h3>
            <p className="text-slate-400 mb-6">Are you sure you want to clear all your reaction time scores? This cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelClear}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClear}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
