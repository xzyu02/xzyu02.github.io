import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import { GameState } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  useEffect(() => {
    const stored = localStorage.getItem('flappyHighScore');
    if (stored) {
      setHighScore(parseInt(stored, 10));
    }
  }, []);

  const handleRestart = () => {
    setGameState(GameState.START);
    setScore(0);
  };

  // Force restart logic is handled within GameCanvas when transitioning from GameOver to Playing
  // but we can reset to start here for the button.
  
  return (
    <div className="relative w-full max-w-md aspect-[2/3] md:h-[600px] md:w-[400px] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-800 select-none" id="game-container">
      <GameCanvas 
        gameState={gameState}
        setGameState={setGameState}
        score={score}
        setScore={setScore}
        highScore={highScore}
        setHighScore={setHighScore}
      />
      <UIOverlay 
        gameState={gameState}
        score={score}
        highScore={highScore}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default App;