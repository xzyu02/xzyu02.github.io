import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, PipeData } from '../types';
import {
  GRAVITY,
  JUMP_STRENGTH,
  PIPE_SPEED,
  PIPE_SPAWN_RATE,
  PIPE_WIDTH,
  PIPE_GAP,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  COLORS,
  BIRD_SIZE
} from '../constants';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  highScore: number;
  setHighScore: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  setGameState,
  score,
  setScore,
  highScore,
  setHighScore
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  
  // Mutable game state references to avoid react re-renders on every frame
  const birdY = useRef<number>(GAME_HEIGHT / 2);
  const birdVelocity = useRef<number>(0);
  const birdRotation = useRef<number>(0);
  const pipes = useRef<PipeData[]>([]);
  const framesSinceLastPipe = useRef<number>(0);
  const groundX = useRef<number>(0);

  // Keep track of score in a ref so update loop can access latest without dependency change
  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Reset game logic
  const resetGame = useCallback(() => {
    birdY.current = GAME_HEIGHT / 2;
    birdVelocity.current = 0;
    birdRotation.current = 0;
    pipes.current = [];
    framesSinceLastPipe.current = 0;
    groundX.current = 0;
    setScore(0);
  }, [setScore]);

  // Jump logic
  const jump = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      birdVelocity.current = JUMP_STRENGTH;
    } else if (gameState === GameState.START || gameState === GameState.GAME_OVER) {
      if (gameState === GameState.GAME_OVER) {
        resetGame();
      }
      setGameState(GameState.PLAYING);
      birdVelocity.current = JUMP_STRENGTH;
    }
  }, [gameState, setGameState, resetGame]);

  // Collision Detection
  const checkCollision = useCallback(() => {
    const birdTop = birdY.current - BIRD_SIZE / 2 + 4; // +4 padding for forgiving hitbox
    const birdBottom = birdY.current + BIRD_SIZE / 2 - 4;
    const birdLeft = GAME_WIDTH / 2 - BIRD_SIZE / 2 + 4;
    const birdRight = GAME_WIDTH / 2 + BIRD_SIZE / 2 - 4;

    // Ground collision
    if (birdBottom >= GAME_HEIGHT - GROUND_HEIGHT) {
      return true;
    }

    // Ceiling collision (optional, prevents flying over pipes)
    if (birdTop <= 0) {
      return true;
    }

    // Pipe collision
    for (const pipe of pipes.current) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      // Check if bird is within horizontal pipe area
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check vertical collision (hitting top pipe OR hitting bottom pipe)
        if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
          return true;
        }
      }
    }

    return false;
  }, []);

  // Main Game Loop
  const update = useCallback(() => {
    if (gameState === GameState.PLAYING) {
      // Calculate Speed based on Score
      // Base speed: PIPE_SPEED (2).
      // Increase by 0.04 per point.
      // At score 25 -> Speed 3 (1.5x)
      // At score 50 -> Speed 4 (2.0x)
      const speedMultiplier = 1 + (scoreRef.current * 0.04);
      const currentSpeed = Math.min(PIPE_SPEED * speedMultiplier, 6); // Cap max speed

      // Physics
      birdVelocity.current += GRAVITY;
      birdY.current += birdVelocity.current;

      // Rotation based on velocity
      birdRotation.current = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (birdVelocity.current * 0.1)));

      // Move Ground
      groundX.current -= currentSpeed;
      if (groundX.current <= -20) groundX.current += 20;

      // Pipe Spawning logic
      // Maintain roughly constant spatial distance between pipes even as speed increases
      const baseSpatialDistance = PIPE_SPEED * PIPE_SPAWN_RATE; // 360px
      const targetFramesBetweenPipes = baseSpatialDistance / currentSpeed;

      framesSinceLastPipe.current++;

      if (framesSinceLastPipe.current >= targetFramesBetweenPipes) {
        const minPipeHeight = 50;
        const maxPipeHeight = GAME_HEIGHT - GROUND_HEIGHT - PIPE_GAP - minPipeHeight;
        const randomHeight = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1) + minPipeHeight);
        
        pipes.current.push({
          x: GAME_WIDTH,
          topHeight: randomHeight,
          passed: false
        });
        framesSinceLastPipe.current = 0;
      }

      // Move Pipes & Remove off-screen
      pipes.current.forEach(pipe => {
        pipe.x -= currentSpeed;
      });
      
      if (pipes.current.length > 0 && pipes.current[0].x < -PIPE_WIDTH) {
        pipes.current.shift();
      }

      // Score Update
      pipes.current.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < GAME_WIDTH / 2 - BIRD_SIZE / 2) {
          pipe.passed = true;
          setScore(s => s + 1);
        }
      });

      // Check Collisions
      if (checkCollision()) {
        setGameState(GameState.GAME_OVER);
      }
    } else if (gameState === GameState.START) {
      // Idle bobbing animation
      birdY.current = GAME_HEIGHT / 2 + Math.sin(Date.now() / 300) * 10;
      
      // Move ground at base speed in idle
      groundX.current -= PIPE_SPEED;
      if (groundX.current <= -20) groundX.current += 20;
    }
  }, [gameState, setGameState, setScore, checkCollision]);

  // Drawing Logic
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Clear
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Background Sky
    ctx.fillStyle = COLORS.SKY;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(100, 100, 30, 0, Math.PI * 2);
    ctx.arc(140, 110, 40, 0, Math.PI * 2);
    ctx.arc(180, 100, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(300, 200, 40, 0, Math.PI * 2);
    ctx.arc(350, 210, 50, 0, Math.PI * 2);
    ctx.arc(400, 200, 40, 0, Math.PI * 2);
    ctx.fill();


    // Draw Pipes
    pipes.current.forEach(pipe => {
      // Top Pipe
      ctx.fillStyle = COLORS.PIPE;
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      ctx.strokeStyle = COLORS.PIPE_BORDER;
      ctx.lineWidth = 2;
      ctx.strokeRect(pipe.x, -2, PIPE_WIDTH, pipe.topHeight + 2);

      // Cap for Top Pipe
      ctx.fillRect(pipe.x - 2, pipe.topHeight - 20, PIPE_WIDTH + 4, 20);
      ctx.strokeRect(pipe.x - 2, pipe.topHeight - 20, PIPE_WIDTH + 4, 20);

      // Bottom Pipe
      const bottomPipeY = pipe.topHeight + PIPE_GAP;
      const bottomPipeHeight = GAME_HEIGHT - GROUND_HEIGHT - bottomPipeY;
      
      ctx.fillStyle = COLORS.PIPE;
      ctx.fillRect(pipe.x, bottomPipeY, PIPE_WIDTH, bottomPipeHeight);
      ctx.strokeRect(pipe.x, bottomPipeY, PIPE_WIDTH, bottomPipeHeight);

      // Cap for Bottom Pipe
      ctx.fillRect(pipe.x - 2, bottomPipeY, PIPE_WIDTH + 4, 20);
      ctx.strokeRect(pipe.x - 2, bottomPipeY, PIPE_WIDTH + 4, 20);
    });

    // Draw Ground
    const groundY = GAME_HEIGHT - GROUND_HEIGHT;
    ctx.fillStyle = COLORS.GROUND_TOP;
    ctx.fillRect(0, groundY, GAME_WIDTH, GROUND_HEIGHT);
    
    // Ground Scrolling Pattern
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, groundY, GAME_WIDTH, GROUND_HEIGHT);
    ctx.clip();

    // Base color for side
    ctx.fillStyle = COLORS.GROUND_SIDE;
    ctx.fillRect(0, groundY + 10, GAME_WIDTH, GROUND_HEIGHT - 10);

    // Diagonal Stripes
    ctx.fillStyle = '#65a626'; // Slightly darker green for stripes
    const stripeWidth = 15;
    const stripeGap = 15;
    const totalPatternWidth = stripeWidth + stripeGap;
    
    // Start drawing from slightly left of screen to cover entrance
    // groundX.current goes from 0 to -20.
    for (let i = groundX.current - 40; i < GAME_WIDTH; i += 30) {
      ctx.beginPath();
      // Draw a diagonal polygon
      ctx.moveTo(i, groundY + 10);
      ctx.lineTo(i + 15, groundY + 10);
      ctx.lineTo(i - 15, GAME_HEIGHT);
      ctx.lineTo(i - 30, GAME_HEIGHT);
      ctx.fill();
    }

    ctx.restore();
    
    // Decorative grass top border
    ctx.strokeStyle = '#558c22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(GAME_WIDTH, groundY);
    ctx.stroke();

    // Draw Bird
    ctx.save();
    ctx.translate(GAME_WIDTH / 2, birdY.current);
    ctx.rotate(birdRotation.current);
    
    // Bird Body
    ctx.fillStyle = COLORS.BIRD;
    ctx.beginPath();
    ctx.arc(0, 0, BIRD_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLORS.BIRD_BORDER;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bird Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(6, -6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(8, -6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Bird Wing
    ctx.fillStyle = '#fdfefe';
    ctx.beginPath();
    ctx.ellipse(-6, 4, 8, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bird Beak
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.lineTo(16, 6);
    ctx.lineTo(8, 10);
    ctx.fill();

    ctx.restore();

  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const loop = () => {
      update();
      if (ctx) draw(ctx);
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update, draw]);

  // Handle Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Ignore touches on buttons/links to allow UI interaction
      if (target.closest('button') || target.closest('a')) {
        return;
      }

      if (e.cancelable) {
        e.preventDefault(); // Prevent scrolling
      }
      jump();
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Ignore clicks on buttons/links
      if (target.closest('button') || target.closest('a')) {
        return;
      }

      if (e.button === 0) jump(); // Left click
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Attach listener to the container to ensure we catch events but check target
    const element = document.getElementById('game-container');
    if (element) {
      element.addEventListener('touchstart', handleTouch, { passive: false });
      element.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (element) {
        element.removeEventListener('touchstart', handleTouch);
        element.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [jump]);

  // Update High Score
  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('flappyHighScore', score.toString());
      }
    }
  }, [gameState, score, highScore, setHighScore]);

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="w-full h-full block"
    />
  );
};

export default GameCanvas;