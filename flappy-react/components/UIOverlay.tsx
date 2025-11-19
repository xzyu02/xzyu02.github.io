import React from 'react';
import { GameState } from '../types';

interface UIOverlayProps {
  gameState: GameState;
  score: number;
  highScore: number;
  onRestart: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, score, highScore, onRestart }) => {
  // Navigation button to return to the main portfolio site
  // Points to ../index.html assuming game is in a subfolder (e.g. /game/)
  const BackButton = () => (
    <a 
      href="../../index.html"
      onClick={(e) => e.stopPropagation()}
      className="absolute top-4 left-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold backdrop-blur-sm transition-all flex items-center gap-2 z-50 pointer-events-auto border-2 border-white/30 shadow-lg text-sm hover:scale-105 active:scale-95 no-underline"
      title="Return to Portfolio"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      <span>Portfolio</span>
    </a>
  );

  if (gameState === GameState.PLAYING) {
    return (
      <div className="absolute top-10 w-full text-center pointer-events-none">
        <span className="text-6xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] stroke-black">
          {score}
        </span>
      </div>
    );
  }

  if (gameState === GameState.START) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 pointer-events-none">
        <BackButton />
        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl text-center animate-bounce-slow border-4 border-slate-800 pointer-events-auto">
          <h1 className="text-4xl font-black text-slate-800 mb-4 uppercase tracking-wider">Flappy React</h1>
          <p className="text-slate-600 mb-6 font-medium">Press Space or Tap to Fly</p>
          <div className="inline-block px-6 py-3 bg-blue-500 text-white rounded-full font-bold shadow-lg animate-pulse">
            START
          </div>
        </div>
      </div>
    );
  }

  if (gameState === GameState.GAME_OVER) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
        <BackButton />
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center border-4 border-slate-800 w-80 transform transition-all scale-100">
          <h2 className="text-3xl font-black text-slate-800 mb-6">GAME OVER</h2>
          
          <div className="flex justify-between mb-2 px-4">
            <span className="text-slate-500 font-bold">SCORE</span>
            <span className="text-slate-800 font-bold text-xl">{score}</span>
          </div>
          <div className="flex justify-between mb-8 px-4 border-b-2 border-slate-100 pb-4">
            <span className="text-orange-500 font-bold">BEST</span>
            <span className="text-slate-800 font-bold text-xl">{highScore}</span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRestart();
            }}
            className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-lg font-bold text-lg shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default UIOverlay;