import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Share2, Copy, Home, RotateCcw, Settings } from 'lucide-react';
import { publicRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getPlayerId } from "../../utils/playerId";
const WordleGame = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const playerId = getPlayerId();
  const [gameState, setGameState] = useState({
    secretWordLength: 5,
    maxAttempts: 6,
    attempts: [],
    attemptsMade: 0,
    isComplete: false,
    hasWon: false,
    isActive: true,
    todayWord: ''
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const inputRef = useRef(null);
  const gameGridRef = useRef(null);
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0
  });

  // Fetch game stats and today's attempts
  const fetchGameData = async () => {
    try {
      // Fetch today's attempts
      const today = new Date().toISOString().split('T')[0];
      const response = await publicRequest.get(
        `/daily-word/attempts/?date=${today}&player_id=${playerId}`
      );
      const attemptsData = response.data;
      
      // Fetch game stats
      const statsResponse = await publicRequest.get(
        `/daily-word/stats/?player_id=${playerId}`
      );
      const statsData = statsResponse.data;
      
      setGameState(prev => ({
        ...prev,
        attempts: attemptsData.attempts || [],
        attemptsMade: attemptsData.count || 0,
        isComplete: attemptsData.count >= 6 || attemptsData.has_won || false,
        hasWon: attemptsData.has_won || false,
        isActive: !(attemptsData.count >= 6 || attemptsData.has_won)
      }));
      
      setGameStats({
        totalGames: statsData.total_games || 0,
        wins: statsData.wins || 0,
        currentStreak: statsData.current_streak || 0,
        maxStreak: statsData.max_streak || 0
      });
      
      console.log('Attempts data:', attemptsData); // Debug log
      const newKeyboardStatus = {};
      attemptsData.attempts?.forEach(attempt => {
        attempt.result?.forEach((status, index) => {
          const letter = attempt.guess[index];
           // Normalize status
          const isCorrect = status === 'correct' || status === 'green';
          const isWrongPlace = status === 'wrong_place' || status === 'orange' || status === 'yellow';
          const isAbsent = status === 'absent' || status === 'black' || status === 'gray';

          // Semantic status hierarchy: correct > wrong_place > absent
          const currentStatus = newKeyboardStatus[letter];
          
          if (isCorrect) {
            newKeyboardStatus[letter] = 'correct';
          } else if (isWrongPlace && currentStatus !== 'correct') {
            newKeyboardStatus[letter] = 'wrong_place';
          } else if (isAbsent && !currentStatus) {
            newKeyboardStatus[letter] = 'absent';
          }
        });
      });
      setKeyboardStatus(newKeyboardStatus);
    } catch (error) {
      console.error('Error fetching game data:', error);
      toast.error('Failed to load game data');
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  // Handle guess submission
  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      toast.error('Guess must be 5 letters long');
      return;
    }

    if (gameState.isComplete) {
      toast.error('Daily game is already completed!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await publicRequest.post('/daily-word/guess/', {
        player_id: playerId,     
        guess: currentGuess.toLowerCase()
      });

      const data = response.data;
      
      // Update game state with new attempt
      const newAttempt = {
        guess: currentGuess.toUpperCase(),
        result: data.result,
        attempt_number: data.attempt
      };

      setGameState(prev => ({
        ...prev,
        attempts: [...prev.attempts, newAttempt],
        attemptsMade: data.attempt,
        isComplete: data.attempt >= 6 || data.win,
        hasWon: data.win,
        isActive: !(data.attempt >= 6 || data.win)
      }));

      // Update keyboard status
      const newKeyboardStatus = { ...keyboardStatus };
      data.result.forEach((status, index) => {
        const letter = currentGuess[index].toUpperCase();
        const currentStatus = newKeyboardStatus[letter];
        
        // Normalize status to handle potential backend inconsistencies
        const isCorrect = status === 'correct' || status === 'green';
        const isWrongPlace = status === 'wrong_place' || status === 'orange' || status === 'yellow';
        const isAbsent = status === 'absent' || status === 'black' || status === 'gray';
        
        if (isCorrect) {
          newKeyboardStatus[letter] = 'correct';
        } else if (isWrongPlace && currentStatus !== 'correct') {
          newKeyboardStatus[letter] = 'wrong_place';
        } else if (isAbsent && !currentStatus) {
          newKeyboardStatus[letter] = 'absent';
        }
      });
      setKeyboardStatus(newKeyboardStatus);

      setCurrentGuess('');
      
      if (data.win) {
        toast.success(`🎉 Congratulations! You guessed the word in ${data.attempt} attempts!`);
        // Refresh stats after win
        setTimeout(() => fetchGameData(), 1000);
      } else if (data.attempt >= 6) {
        toast.error('Game Over! Better luck tomorrow!');
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data?.error || 'Failed to submit guess';
        
        // Handle specific "Not a valid word" error
        if (errorMsg === 'Not a valid word' || errorMsg.toLowerCase().includes('not a valid word')) {
          toast.error('Not a valid word');
        } else {
          toast.error(errorMsg);
        }
        
        if (error.response.status === 400 && error.response.data?.error?.includes('Maximum attempts')) {
          setGameState(prev => ({ ...prev, isComplete: true, isActive: false }));
        }
      } else {
        toast.error('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
      // Keep focus on input after submit
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Handle input change from hidden input
  const handleInputChange = (e) => {
    if (gameState.isComplete || !gameState.isActive) return;
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5);
    setCurrentGuess(value);
  };

  // Handle keyboard input
  const handleKeyPress = (key) => {
    if (gameState.isComplete || !gameState.isActive) return;

    if (key === 'ENTER') {
      if (currentGuess.length === 5) {
        submitGuess();
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  };

  // Handle physical keyboard
  // Handle physical keyboard (desktop)
  useEffect(() => {
    const handlePhysicalKeyPress = (e) => {
      // Ignore if typing in the hidden input to avoid double letters
      if (e.target.tagName === 'INPUT') return;

      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Za-z]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        handleKeyPress(e.key.toUpperCase());
        // Also update the hidden input value to match
        if (inputRef.current) {
           inputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [currentGuess, gameState]);
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update input value when currentGuess changes (e.g. via virtual keyboard)
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== currentGuess) {
      inputRef.current.value = currentGuess;
    }
  }, [currentGuess]);

  // Keyboard rows
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  // Get color class for keyboard key
  const getKeyColorClass = (key) => {
    const status = keyboardStatus[key];
    switch (status) {
      case 'correct': return 'bg-green-600 text-white';
      case 'wrong_place': return 'bg-orange-500 text-white';
      case 'absent': return 'bg-gray-800 text-gray-400';
      default: return 'bg-gray-700 hover:bg-gray-600 text-white';
    }
  };

  // Get color for guess box
  const getBoxColorClass = (status) => {
    switch (status) {
      case 'correct': return 'bg-green-600 border-green-600';
      case 'wrong_place': return 'bg-orange-500 border-orange-500';
      case 'absent': return 'bg-gray-800 border-gray-700';
      default: return 'bg-gray-900 border-gray-700';
    }
  };

  // Format date for display
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Share results
  const shareResults = () => {
    if (!gameState.attemptsMade) {
      toast.info('Play the game first to share results!');
      return;
    }

    const results = gameState.attempts.map(attempt => 
      attempt.result.map(status => {
        switch(status) {
          case 'green': return '🟩';
          case 'orange': return '🟨';
          case 'black': return '⬛';
          default: return '⬜';
        }
      }).join('')
    ).join('\n');

    const shareText = `Daily Wordle ${formattedDate}\n\n${results}\n\n${gameState.hasWon ? `✅ Solved in ${gameState.attemptsMade}/6` : '❌ Failed'}\n\nPlay at: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Daily Wordle Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Link to="/" className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              <Home size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Daily Wordle
              </h1>
              <p className="text-sm text-gray-400">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={shareResults}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
            >
              <Share2 size={16} />
              <span>Share Results</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{gameStats.totalGames}</div>
            <div className="text-sm text-gray-400">Played</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">
              {gameStats.totalGames > 0 ? Math.round((gameStats.wins / gameStats.totalGames) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400">Win %</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{gameStats.currentStreak}</div>
            <div className="text-sm text-gray-400">Streak</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{gameStats.maxStreak}</div>
            <div className="text-sm text-gray-400">Max</div>
          </div>
        </div>

        {/* Game Status */}
        {gameState.gameId && (
          <div className="mb-6 p-4 bg-gray-800 rounded-xl">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">
                  Daily Challenge • Attempts: {gameState.attemptsMade}/6
                </div>
              </div>
              
              {gameState.isComplete && (
                <div className={`text-lg font-bold px-4 py-2 rounded-lg ${
                  gameState.hasWon ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                }`}>
                  {gameState.hasWon ? '🎉 You Won!' : '💀 Game Over'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Grid */}
        <div 
          ref={gameGridRef}
          className="mb-8 relative cursor-text" 
          onClick={() => inputRef.current?.focus()}
        >
          {/* Hidden Input for Mobile Keyboard */}
          <input
            ref={inputRef}
            type="text"
            className="opacity-0 absolute top-0 left-0 w-full h-full -z-10"
            value={currentGuess}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                submitGuess();
              }
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck="false"
          />
          
          <div className="grid grid-cols-1 gap-2 mb-4">
            {/* Previous attempts */}
            {Array.from({ length: 6 }).map((_, attemptIndex) => {
              const attempt = gameState.attempts[attemptIndex];
              const isCurrent = attemptIndex === gameState.attemptsMade && !gameState.isComplete;
              
              return (
                <div key={attemptIndex} className="flex justify-center space-x-2">
                  {Array.from({ length: 5 }).map((_, letterIndex) => {
                    let letter = '';
                    let status = '';
                    
                    if (attempt) {
                      letter = attempt.guess[letterIndex] || '';
                      status = attempt.result?.[letterIndex] || '';
                    } else if (isCurrent) {
                      letter = currentGuess[letterIndex] || '';
                    }
                    
                    return (
                      <div
                        key={letterIndex}
                        className={`
                          w-14 h-14 md:w-16 md:h-16 flex items-center justify-center
                          text-2xl md:text-3xl font-bold uppercase
                          border-2 rounded-lg transition-all duration-300
                          ${getBoxColorClass(status)}
                          ${!status && letter ? 'bg-gray-900 border-gray-600' : ''}
                          ${!letter ? 'border-gray-700' : ''}
                          ${attempt ? 'animate-flip' : 'animate-fade-in'}
                        `}
                        style={{ animationDelay: `${letterIndex * (attempt ? 300 : 50)}ms` }}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="space-y-2">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center space-x-1">
                {row.map((key) => {
                  const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
                  const keyClass = `flex-1 h-14 rounded-lg font-semibold transition
                    ${getKeyColorClass(key)}
                    ${isSpecial ? 'px-4' : 'px-2'}
                    ${isSpecial ? 'text-sm' : 'text-lg'}
                  `;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      disabled={isLoading || gameState.isComplete}
                      className={keyClass}
                    >
                      {key === 'BACKSPACE' ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                          </svg>
                        </div>
                      ) : key === 'ENTER' ? (
                        <span className="text-xs">ENTER</span>
                      ) : (
                        key
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-xl mx-auto p-4 bg-gray-800/50 rounded-xl">
          <h3 className="font-bold mb-2 text-gray-300">How to Play</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">✓</div>
              <span className="text-gray-400">Correct letter & position</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">!</div>
              <span className="text-gray-400">Correct letter, wrong position</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">✗</div>
              <span className="text-gray-400">Letter not in word</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 text-center">
            One word per day • Resets at midnight
          </p>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
      />
    </div>
  );
};

export default WordleGame;
