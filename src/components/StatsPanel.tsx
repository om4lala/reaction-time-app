import React from 'react';
import { Trophy, TrendingDown, Clock, RotateCcw } from 'lucide-react';

interface StatsPanelProps {
  scores: number[];
  onClear: () => void;
}

export function StatsPanel({ scores, onClear }: StatsPanelProps) {
  const best = scores.length > 0 ? Math.min(...scores) : null;
  const avg = scores.length > 0 
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-display font-semibold text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-400" />
          Your Stats
        </h2>
        
        {scores.length > 0 && (
          <button
            onClick={onClear}
            className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-slate-800"
            title="Clear History"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium">Personal Best</span>
          </div>
          <div className="text-2xl font-mono text-slate-100 font-semibold tracking-tight">
            {best !== null ? `${best} ms` : '--'}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium">Average</span>
          </div>
          <div className="text-2xl font-mono text-slate-100 font-semibold tracking-tight">
            {avg !== null ? `${avg} ms` : '--'}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">
          Recent Attempts ({scores.length})
        </h3>
        
        {scores.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
            <p>No attempts yet.</p>
            <p>Complete a test to log scores.</p>
          </div>
        ) : (
          <div className="overflow-y-auto pr-2 space-y-2 flex-1 max-h-[300px] lg:max-h-none custom-scrollbar">
            {scores.slice().reverse().map((score, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 text-sm"
              >
                <span className="text-slate-400">Attempt {scores.length - idx}</span>
                <span className="font-mono text-slate-200">{score} ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
