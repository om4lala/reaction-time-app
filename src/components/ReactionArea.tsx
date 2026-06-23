// src/components/ReactionArea.tsx
import React, { useRef, useCallback, useEffect } from 'react';
import { GameState } from '../types';
import { Zap, AlertTriangle, MousePointerClick, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReactionAreaProps {
  gameState: GameState;
  reactionTime: number | null;
  setGameState: (state: GameState) => void;
  setReactionTime: (time: number | null) => void;
  addScore: (score: number) => void;
}

export function ReactionArea({
  gameState,
  reactionTime,
  setGameState,
  setReactionTime,
  addScore,
}: ReactionAreaProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const currentStateRef = useRef<GameState>(gameState);
  const stateEntryTimeRef = useRef<number>(0);

  // Keep ref sync with state from props
  useEffect(() => {
    currentStateRef.current = gameState;
    stateEntryTimeRef.current = performance.now();
  }, [gameState]);

  // Clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleInteraction = useCallback((e?: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    const currentState = currentStateRef.current;
    const timeInState = performance.now() - stateEntryTimeRef.current;

    // Debounce: prevent actions if we JUST entered a state within the last 150ms 
    // EXCEPT when in 'ready' state where we want to capture reaction time instantly!
    // This fixes the "infinitely loops to try again" caused by physical mouse double-clicks/bouncing
    // and prevents the user from accidentally skipping the result screen before seeing it.
    if (currentState !== 'ready' && timeInState < 200) {
      return;
    }

    if (currentState === 'idle' || currentState === 'result' || currentState === 'early') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      // Start the test
      setGameState('waiting');
      setReactionTime(null);
      currentStateRef.current = 'waiting';
      stateEntryTimeRef.current = performance.now();

      // Random wait between 1.5s and 5s
      const waitTime = Math.floor(Math.random() * 3500) + 1500;
      
      timeoutRef.current = setTimeout(() => {
        setGameState('ready');
        currentStateRef.current = 'ready';
        stateEntryTimeRef.current = performance.now();
        startTimeRef.current = performance.now();
      }, waitTime);
      
    } else if (currentState === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
      currentStateRef.current = 'early';
      stateEntryTimeRef.current = performance.now();
      
    } else if (currentState === 'ready') {
      // Successful reaction
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      
      setReactionTime(time);
      addScore(time);
      setGameState('result');
      currentStateRef.current = 'result';
      stateEntryTimeRef.current = performance.now();
    }
  }, [setGameState, setReactionTime, addScore]);

  // Determine appearance based on state
  let bgColorClass = 'bg-slate-800 hover:bg-slate-700';
  let icon = <Zap className="w-12 h-12 mb-4 text-indigo-400" />;
  let title = 'Reaction Time Test';
  let subtitle = 'Click to start the test';
  let pulse = false;

  if (gameState === 'waiting') {
    bgColorClass = 'bg-red-500/90 hover:bg-red-500';
    icon = <Timer className="w-12 h-12 mb-4 text-red-100" />;
    title = 'Wait for green...';
    subtitle = 'Do not click yet!';
  } else if (gameState === 'ready') {
    bgColorClass = 'bg-emerald-500 hover:bg-emerald-400';
    icon = <MousePointerClick className="w-16 h-16 mb-4 text-white" />;
    title = 'CLICK!';
    subtitle = 'As fast as you can!';
    pulse = true;
  } else if (gameState === 'early') {
    bgColorClass = 'bg-slate-800 hover:bg-slate-700';
    icon = <AlertTriangle className="w-12 h-12 mb-4 text-amber-500" />;
    title = 'Too soon!';
    subtitle = 'Click to try again.';
  } else if (gameState === 'result') {
    bgColorClass = 'bg-indigo-600 hover:bg-indigo-500';
    icon = <Timer className="w-12 h-12 mb-4 text-indigo-200" />;
    title = `${reactionTime} ms`;
    subtitle = 'Click to try again.';
  }

  return (
    <motion.div
      layout
      className={`relative w-full h-[500px] lg:h-full rounded-3xl cursor-pointer select-none overflow-hidden border-2 border-transparent flex flex-col items-center justify-center ${bgColorClass}`}
      onPointerDown={handleInteraction}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={gameState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: gameState === 'ready' ? 0 : 0.2 }}
          className="flex flex-col items-center text-center p-8"
        >
          {pulse ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              {icon}
            </motion.div>
          ) : (
            icon
          )}
          
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 ${
            gameState === 'ready' || gameState === 'result' ? 'text-white font-mono' : 'text-slate-100'
          }`}>
            {title}
          </h1>
          
          <p className={`text-lg sm:text-xl font-medium ${
            gameState === 'waiting' || gameState === 'ready' || gameState === 'result'
              ? 'text-white/80' 
              : 'text-slate-400'
          }`}>
            {subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
