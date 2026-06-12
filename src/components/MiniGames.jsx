import React, { useState, useEffect, useRef } from 'react';
import { useSimulator, CHARACTERS } from '../context/SimulatorContext';
import { Gamepad2, Heart, Award, RefreshCw, Star, XCircle } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    q: "What is your ideal weekend plan?",
    options: [
      { text: "Cozy gaming session & memes 🎮", fit: "maya" },
      { text: "Baking fresh cookies & reading ☕", fit: "priya" },
      { text: "Watercolor painting by the beach 🎨", fit: "diya" },
      { text: "Espresso & fixing code compile bugs 💻", fit: "anjali" },
      { text: "Quiet gardening and stargazing 🌸", fit: "kavya" }
    ]
  },
  {
    id: 2,
    q: "How do you express care to someone?",
    options: [
      { text: "Tagging them in hilarious gaming memes", fit: "maya" },
      { text: "Cooking healthy food & asking 'Sapteeya?'", fit: "priya" },
      { text: "Singing acoustic melodies with guitar", fit: "diya" },
      { text: "Teasing them gently with clever brain jokes", fit: "anjali" },
      { text: "Giving handmade origami or flowers silently", fit: "kavya" }
    ]
  },
  {
    id: 3,
    q: "If she is upset, what is your approach?",
    options: [
      { text: "Carry them in multiplayer matches to win! 🏆", fit: "maya" },
      { text: "Bring hot tea & cozy blanket to listen to her", fit: "priya" },
      { text: "Draw a cute cartoon sketch to cheer her up", fit: "diya" },
      { text: "Explain logically how we can debug the issue", fit: "anjali" },
      { text: "Sit together quietly in the backyard garden", fit: "kavya" }
    ]
  },
  {
    id: 4,
    q: "What is your dream future with her?",
    options: [
      { text: "Building an awesome pro-gaming rig setup together", fit: "maya" },
      { text: "A peaceful cottage house with kitchen & library", fit: "priya" },
      { text: "Visiting historic art museums in Europe", fit: "diya" },
      { text: "Launching a tech startup company in Chennai", fit: "anjali" },
      { text: "Stargazing from a rooftop garden every night", fit: "kavya" }
    ]
  }
];

export default function MiniGames() {
  const { activeCharId, performActivity, charStates } = useSimulator();
  const activeChar = CHARACTERS.find(c => c.id === activeCharId);
  const charState = charStates[activeCharId] || { love: 20 };

  const [activeGame, setActiveGame] = useState(null); // null | 'catch' | 'quiz'

  // CANVAS GAME STATE
  const canvasRef = useRef(null);
  const [isPlayingCatch, setIsPlayingCatch] = useState(false);
  const [catchScore, setCatchScore] = useState(0);
  const [catchTimeLeft, setCatchTimeLeft] = useState(30);
  const [catchHighScore, setCatchHighScore] = useState(() => {
    return parseInt(localStorage.getItem('vfg_catch_highscore') || '0');
  });

  // QUIZ STATE
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]); // array of 'fit' values
  const [quizResult, setQuizResult] = useState(null); // null | score%

  if (!activeChar) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-400">
        Please select a Girlfriend character first to play mini-games.
      </div>
    );
  }

  // HEART CATCH GAME LOGIC
  useEffect(() => {
    if (activeGame !== 'catch' || !isPlayingCatch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let basket = { x: canvas.width / 2 - 35, y: canvas.height - 25, width: 70, height: 15 };
    let items = [];
    let gameScore = 0;

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = e.clientX - rect.left - root.scrollLeft;
      basket.x = Math.max(0, Math.min(canvas.width - basket.width, mouseX - basket.width / 2));
    };

    // Handle touch movement
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        basket.x = Math.max(0, Math.min(canvas.width - basket.width, touchX - basket.width / 2));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    // Spawning items helper
    const spawnItem = () => {
      const type = Math.random() > 0.2 ? 'heart' : 'bomb'; // 80% heart, 20% bomb
      const speed = Math.random() * 2 + 1.5;
      const size = 16;
      items.push({
        x: Math.random() * (canvas.width - size * 2) + size,
        y: -10,
        type,
        speed,
        size
      });
    };

    let spawnTimer = 0;

    // Game loop
    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Basket
      ctx.fillStyle = '#f43f5e'; // pink-500
      ctx.beginPath();
      ctx.roundRect(basket.x, basket.y, basket.width, basket.height, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BASKET', basket.x + basket.width / 2, basket.y + 11);

      // Update and Draw Items
      spawnTimer++;
      if (spawnTimer > 35) {
        spawnItem();
        spawnTimer = 0;
      }

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;

        // Draw item emoji
        ctx.font = `${item.size * 1.2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.type === 'heart' ? '❤️' : '💣', item.x, item.y);

        // Check basket collision
        if (
          item.y + item.size / 2 >= basket.y &&
          item.y - item.size / 2 <= basket.y + basket.height &&
          item.x + item.size / 2 >= basket.x &&
          item.x - item.size / 2 <= basket.x + basket.width
        ) {
          if (item.type === 'heart') {
            gameScore += 10;
          } else {
            gameScore = Math.max(0, gameScore - 20);
          }
          setCatchScore(gameScore);
          items.splice(i, 1);
          continue;
        }

        // Out of bounds cleanup
        if (item.y > canvas.height + 10) {
          items.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [activeGame, isPlayingCatch]);

  // CATCH TIMER
  useEffect(() => {
    if (!isPlayingCatch) return;

    if (catchTimeLeft === 0) {
      setIsPlayingCatch(false);
      
      // Save Highscore
      if (catchScore > catchHighScore) {
        setCatchHighScore(catchScore);
        localStorage.setItem('vfg_catch_highscore', catchScore.toString());
      }

      // Perform Simulator gain
      performActivity(activeCharId, 'game', { loveBonus: 6, friendshipBonus: 15 });
      return;
    }

    const timer = setTimeout(() => {
      setCatchTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlayingCatch, catchTimeLeft]);

  const startCatchGame = () => {
    setCatchScore(0);
    setCatchTimeLeft(30);
    setIsPlayingCatch(true);
  };

  // COMPATIBILITY QUIZ LOGIC
  const handleQuizAnswer = (fit) => {
    const nextAnswers = [...quizAnswers, fit];
    setQuizAnswers(nextAnswers);

    if (quizStep + 1 < QUIZ_QUESTIONS.length) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate Compatibility
      // Check how many answers fit the active girlfriend's ID
      const matches = nextAnswers.filter(ans => ans === activeCharId).length;
      const matchPct = Math.round((matches / QUIZ_QUESTIONS.length) * 100);
      
      // Reward based on score
      const bonusPct = matchPct >= 50 ? 10 : 5;
      performActivity(activeCharId, 'game', { loveBonus: bonusPct, trustBonus: bonusPct });
      setQuizResult(matchPct);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 select-none h-full flex flex-col justify-between">
      {/* Game Menu list */}
      {activeGame === null && (
        <div className="space-y-4 flex-grow flex flex-col justify-center">
          <div className="text-center py-2 space-y-1">
            <Gamepad2 className="w-8 h-8 text-pink-500 mx-auto animate-bounce" />
            <h3 className="font-bold text-sm">Girlfriend Mini-Games</h3>
            <p className="text-[10px] text-gray-400">Play games to build stats and increase friendship levels!</p>
          </div>

          <div className="space-y-3">
            {/* Heart Catch Card */}
            <button
              onClick={() => {
                setActiveGame('catch');
                startCatchGame();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:border-pink-500/30 group text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 rounded-xl bg-pink-500/10 group-hover:scale-110 transition-transform">
                  ❤️
                </span>
                <div>
                  <h4 className="font-bold text-xs">Heart Catch Game</h4>
                  <p className="text-[9px] text-gray-400">Catch hearts in a basket! Highscore: {catchHighScore}</p>
                </div>
              </div>
              <span className="text-[9px] text-pink-400 font-bold px-2 py-0.5 rounded-full bg-pink-500/10">
                +15 Friendship
              </span>
            </button>

            {/* Compatibility Quiz Card */}
            <button
              onClick={() => {
                setActiveGame('quiz');
                resetQuiz();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl glass-card hover:border-purple-500/30 group text-left transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 rounded-xl bg-purple-500/10 group-hover:scale-110 transition-transform">
                  🧠
                </span>
                <div>
                  <h4 className="font-bold text-xs">Compatibility Love Test</h4>
                  <p className="text-[9px] text-gray-400">Check how much your interests align!</p>
                </div>
              </div>
              <span className="text-[9px] text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-500/10">
                +10 Love & Trust
              </span>
            </button>
          </div>
        </div>
      )}

      {/* HEART CATCH GAME SCREEN */}
      {activeGame === 'catch' && (
        <div className="space-y-4 flex flex-col items-center justify-between flex-grow">
          <div className="flex items-center justify-between w-full text-xs">
            <span className="font-bold">Score: <span className="text-pink-400 font-extrabold">{catchScore}</span></span>
            <span className="font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/5">Time: {catchTimeLeft}s</span>
          </div>

          <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-[#0d0a1b] w-full max-w-[320px] aspect-[4/5] mx-auto shadow-inner flex items-center justify-center">
            {isPlayingCatch ? (
              <canvas
                ref={canvasRef}
                width={300}
                height={375}
                className="block cursor-none touch-none"
              />
            ) : (
              // GAME OVER OR START OVERLAY
              <div className="p-5 text-center space-y-4 z-10">
                <Trophy className="w-10 h-10 text-yellow-500 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-sm text-pink-400">Game Over!</h4>
                <div className="space-y-1 text-xs">
                  <p className="text-gray-300">Final Score: <span className="font-bold text-white">{catchScore}</span></p>
                  <p className="text-gray-400 text-[10px]">Highscore: {catchHighScore}</p>
                </div>
                <p className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
                  Relationship rewards loaded! ❤️ +5 | 🤝 +15
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={startCatchGame}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-xs font-bold transition-all"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold transition-all"
                  >
                    Exit Menu
                  </button>
                </div>
              </div>
            )}
          </div>

          {isPlayingCatch && (
            <p className="text-[10px] text-gray-500 text-center select-none">
              Move cursor left/right or slide finger to control the basket.
            </p>
          )}
        </div>
      )}

      {/* COMPATIBILITY QUIZ SCREEN */}
      {activeGame === 'quiz' && (
        <div className="space-y-4 flex-grow flex flex-col justify-center">
          {quizResult === null ? (
            // QUIZ QUESTION VIEW
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>Quiz alignment test</span>
                <span>Question {quizStep + 1} of {QUIZ_QUESTIONS.length}</span>
              </div>

              {/* Progress dots */}
              <div className="flex gap-1">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i <= quizStep ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <h4 className="font-bold text-xs text-white bg-white/5 border border-white/5 p-3.5 rounded-xl leading-relaxed">
                {QUIZ_QUESTIONS[quizStep].q}
              </h4>

              <div className="space-y-2">
                {QUIZ_QUESTIONS[quizStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(option.fit)}
                    className="w-full py-2.5 px-3.5 text-left rounded-xl glass-card hover:border-pink-500/30 text-xs font-medium transition-all"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // QUIZ RESULTS VIEW
            <div className="p-4 text-center space-y-4">
              <Award className="w-12 h-12 text-purple-400 mx-auto animate-pulse" />
              <h4 className="font-extrabold text-sm">Compatibility Result</h4>
              
              <div className="inline-flex flex-col items-center justify-center p-5 rounded-full bg-purple-500/10 border-2 border-purple-500/30 h-28 w-28 mx-auto">
                <span className="text-2xl font-extrabold text-purple-400 leading-none">{quizResult}%</span>
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-1">Match</span>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-gray-300">
                  {quizResult >= 75 
                    ? `Wow! Perfect match da! You and ${activeChar.name} share similar ideas. 🥰` 
                    : quizResult >= 50 
                    ? `Great match! You both vibing well. Keep talking da! 🌸` 
                    : `Interesting! Opposite poles attract. Get to know ${activeChar.name} better! 👉👈`}
                </p>
                <p className="text-[10px] text-purple-400 font-medium bg-purple-500/10 border border-purple-500/20 px-2 py-1.5 rounded-full">
                  Relationship rewards loaded! Love & Trust increased! 💖
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetQuiz}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold transition-all"
                >
                  Exit Menu
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
