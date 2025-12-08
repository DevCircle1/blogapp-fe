import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Share2, Copy, Home, RotateCcw, Settings } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const WordleGame = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState({
    gameId: '',
    secretWordLength: 5,
    maxAttempts: 6,
    attempts: [],
    attemptsMade: 0,
    isComplete: false,
    hasWon: false,
    isActive: true
  });
  const [currentGuess, setCurrentGuess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGameData, setNewGameData] = useState({
    secretWord: '',
    maxAttempts: 6
  });
  const [keyboardStatus, setKeyboardStatus] = useState({});
  const inputRefs = useRef([]);

  // Fetch game status
  const fetchGameStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/`);
      const data = await response.json();
      setGameState({
        gameId: data.game_id,
        secretWordLength: data.secret_word_length,
        maxAttempts: data.max_attempts,
        attempts: data.attempts || [],
        attemptsMade: data.attempts_made,
        isComplete: data.is_complete,
        hasWon: data.has_won,
        isActive: data.is_active
      });
      
      // Update keyboard status based on attempts
      const newKeyboardStatus = {};
      data.attempts?.forEach(attempt => {
        attempt.feedback?.forEach((status, index) => {
          const letter = attempt.guess[index];
          if (!newKeyboardStatus[letter] || 
              (status === 'green' && newKeyboardStatus[letter] !== 'green') ||
              (status === 'orange' && newKeyboardStatus[letter] === 'black')) {
            newKeyboardStatus[letter] = status;
          }
        });
      });
      setKeyboardStatus(newKeyboardStatus);
    } catch (error) {
      toast.error('Game not found!');
      navigate('/');
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGameStatus();
    }
  }, [gameId]);

  // Handle guess submission
  const submitGuess = async () => {
    if (currentGuess.length !== gameState.secretWordLength) {
      toast.error(`Guess must be ${gameState.secretWordLength} letters long`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/guess/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess: currentGuess.toUpperCase() })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit guess');
      }

      // Update game state
      setGameState(prev => ({
        ...prev,
        attempts: [...prev.attempts, {
          guess: currentGuess.toUpperCase(),
          feedback: data.feedback,
          attempt_number: data.attempt_number
        }],
        attemptsMade: prev.attemptsMade + 1,
        isComplete: data.is_complete,
        hasWon: data.has_won,
        isActive: !data.is_complete
      }));

      // Update keyboard status
      const newKeyboardStatus = { ...keyboardStatus };
      data.feedback.forEach((status, index) => {
        const letter = currentGuess[index].toUpperCase();
        if (!newKeyboardStatus[letter] || 
            (status === 'green' && newKeyboardStatus[letter] !== 'green') ||
            (status === 'orange' && newKeyboardStatus[letter] === 'black')) {
          newKeyboardStatus[letter] = status;
        }
      });
      setKeyboardStatus(newKeyboardStatus);

      setCurrentGuess('');
      
      if (data.has_won) {
        toast.success('🎉 Congratulations! You guessed the word!');
      } else if (data.is_complete) {
        toast.error('Game Over! Try again.');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard input
  const handleKeyPress = (key) => {
    if (gameState.isComplete || !gameState.isActive) return;

    if (key === 'ENTER') {
      if (currentGuess.length === gameState.secretWordLength) {
        submitGuess();
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < gameState.secretWordLength && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  };

  // Handle physical keyboard
  useEffect(() => {
    const handlePhysicalKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Za-z]$/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyPress);
    return () => window.removeEventListener('keydown', handlePhysicalKeyPress);
  }, [currentGuess, gameState]);

  // Create new game
  const createNewGame = async () => {
    if (!newGameData.secretWord) {
      toast.error('Please enter a secret word');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret_word: newGameData.secretWord.toUpperCase(),
          max_attempts: newGameData.maxAttempts
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to create game');
      }

      navigate(`/game/${data.game_id}`);
      setShowCreateModal(false);
      setNewGameData({ secretWord: '', maxAttempts: 6 });
      toast.success('Game created! Share the link with friends.');
    } catch (error) {
      toast.error('Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

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
      case 'green': return 'bg-green-600 text-white';
      case 'orange': return 'bg-orange-500 text-white';
      case 'black': return 'bg-gray-800 text-gray-400';
      default: return 'bg-gray-700 hover:bg-gray-600 text-white';
    }
  };

  // Get color for guess box
  const getBoxColorClass = (status) => {
    switch (status) {
      case 'green': return 'bg-green-600 border-green-600';
      case 'orange': return 'bg-orange-500 border-orange-500';
      case 'black': return 'bg-gray-800 border-gray-700';
      default: return 'bg-gray-900 border-gray-700';
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Custom Wordle
            </h1>
          </div>
          
          <div className="flex space-x-2">
            {gameState.gameId && (
              <CopyToClipboard 
                text={`${window.location.origin}/game/${gameState.gameId}`}
                onCopy={() => toast.success('Link copied to clipboard!')}
              >
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition">
                  <Share2 size={16} />
                  <span>Share Game</span>
                </button>
              </CopyToClipboard>
            )}
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
            >
              <Settings size={16} />
              <span>New Game</span>
            </button>
          </div>
        </div>

        {/* Game Info */}
        {gameState.gameId && (
          <div className="mb-6 p-4 bg-gray-800 rounded-xl">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-400">Game ID:</span>
                  <span className="font-mono font-bold text-lg bg-gray-900 px-3 py-1 rounded">
                    {gameState.gameId}
                  </span>
                  <CopyToClipboard 
                    text={gameState.gameId}
                    onCopy={() => toast.info('Game ID copied!')}
                  >
                    <button className="p-1 hover:bg-gray-700 rounded">
                      <Copy size={14} />
                    </button>
                  </CopyToClipboard>
                </div>
                <div className="text-sm text-gray-300">
                  Word length: {gameState.secretWordLength} letters • 
                  Attempts: {gameState.attemptsMade}/{gameState.maxAttempts}
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
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-2 mb-4">
            {/* Previous attempts */}
            {Array.from({ length: gameState.maxAttempts }).map((_, attemptIndex) => {
              const attempt = gameState.attempts[attemptIndex];
              const isCurrent = attemptIndex === gameState.attemptsMade && !gameState.isComplete;
              
              return (
                <div key={attemptIndex} className="flex justify-center space-x-2">
                  {Array.from({ length: gameState.secretWordLength }).map((_, letterIndex) => {
                    let letter = '';
                    let status = '';
                    
                    if (attempt) {
                      letter = attempt.guess[letterIndex] || '';
                      status = attempt.feedback?.[letterIndex] || '';
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
                          animate-fade-in
                        `}
                        style={{ animationDelay: `${letterIndex * 50}ms` }}
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
        </div>
      </div>

      {/* Create Game Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Game</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Secret Word
                </label>
                <input
                  type="text"
                  value={newGameData.secretWord}
                  onChange={(e) => setNewGameData({
                    ...newGameData,
                    secretWord: e.target.value.replace(/[^A-Za-z]/gi, '')
                  })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter your secret word"
                  maxLength={10}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Word length: {newGameData.secretWord.length} letters (Max: 10)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Attempts
                </label>
                <select
                  value={newGameData.maxAttempts}
                  onChange={(e) => setNewGameData({
                    ...newGameData,
                    maxAttempts: parseInt(e.target.value)
                  })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} attempts</option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewGame}
                  disabled={!newGameData.secretWord || isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create Game'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
      />
    </div>
  );
};

// Add to your tailwind.config.js
const tailwindConfigAddition = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      }
    }
  }
};

export default WordleGame;