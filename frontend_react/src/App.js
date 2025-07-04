import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './Canvas';

// PUBLIC_INTERFACE
/**
 * SketchSolo App main container
 * Manages overall game state (mode, score, round, loading/errors, result, and modal)
 * Scaffolds layout for future game and UI component integration.
 */
function App() {
  // Theme (light or dark)
  const [theme, setTheme] = useState('light');

  // Game state management
  const [mode, setMode] = useState('draw');            // 'draw' or 'guess'
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);           // { correct: true/false, msg: string, answer: string }
  const [modalOpen, setModalOpen] = useState(false);

  // Game data
  const [currentWord, setCurrentWord] = useState('');           // word to draw, or correct answer for guess mode
  const [currentDrawing, setCurrentDrawing] = useState(null);   // drawing data (imageURL or base64)

  // Effect to enforce chosen theme on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  /**
   * Toggles between light and dark themes.
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Handler stubs for game logic (expand as needed)
  const startNewGame = (selectedMode = 'draw') => {
    setMode(selectedMode);
    setScore({ correct: 0, total: 0 });
    setRound(1);
    setResult(null);
    setError('');
    setModalOpen(false);
    // TODO: Fetch initial word/drawing based on mode
    setCurrentWord('');
    setCurrentDrawing(null);
  };

  const handleRoundEnd = (isCorrect, msg, answer = '') => {
    setScore(s => ({
      correct: isCorrect ? s.correct + 1 : s.correct,
      total: s.total + 1
    }));
    setResult({ correct: isCorrect, msg, answer });
    setModalOpen(true);
  };

  // Placeholder: main UI structure
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-row">
          <div className="header-title">
            <h1 className="game-title">SketchSolo</h1>
          </div>
          <div className="header-score">
            <span className="score-label">
              <strong>Score:</strong> {score.correct}/{score.total}
            </span>
            <span className="score-round">
              <strong>Round:</strong> {round}
            </span>
          </div>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        {/* Game mode switcher (draw/guess) */}
        <div className="mode-switcher">
          <button
            className={mode === 'draw' ? 'btn active' : 'btn'}
            onClick={() => startNewGame('draw')}
          >
            🎨 Draw Mode
          </button>
          <button
            className={mode === 'guess' ? 'btn active' : 'btn'}
            onClick={() => startNewGame('guess')}
          >
            🤔 Guess Mode
          </button>
        </div>
      </header>

      <main style={{ minHeight: 340, padding: '2rem 0' }}>
        {/* Loading/Error section */}
        {loading && (
          <div className="loading">Loading...</div>
        )}
        {error && (
          <div className="error" role="alert" style={{ color: 'crimson', margin: 10 }}>
            {error}
          </div>
        )}

        {/* GamePanel: Render Canvas in draw mode, or placeholder for guess mode */}
        <section>
          {mode === "draw" ? (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {/* Drawing Canvas (enabled) */}
              <Canvas
                width={340}
                height={220}
                disabled={false}
                onChange={(dataUrl) => {
                  // Data URL provided when drawing changes
                  setCurrentDrawing(dataUrl);
                }}
              />
            </div>
          ) : (
            <div style={{
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)',
              borderRadius: 12,
              background: 'var(--bg-secondary)'
            }}>
              <span style={{ color: '#bbb' }}>[Drawing display for guessing coming soon]</span>
            </div>
          )}
        </section>

        {/* TODO: Insert InputArea (prompt, input, submit button) */}
        <section style={{ marginTop: 30 }}>
          <div>
            <span style={{ color: '#ccc' }}>[Input area placeholder]</span>
          </div>
        </section>
      </main>

      {/* Result Modal / Section */}
      {modalOpen && result && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.12)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal-content"
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 20,
              padding: '2rem 2.5rem',
              minWidth: 320,
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ color: result.correct ? '#27ae60' : '#2980b9', marginBottom: 15 }}>
              {result.correct ? "🎉 Correct!" : "❌ Try Again!"}
            </h2>
            <div style={{ marginBottom: 10 }}>
              {result.msg}
            </div>
            {result.answer && (
              <div style={{ fontSize: 18, marginBottom: 10 }}>
                <strong>Answer:</strong> {result.answer}
              </div>
            )}
            <button
              className="btn"
              style={{ marginTop: 12, minWidth: 120 }}
              onClick={() => {
                setModalOpen(false);
                setResult(null);
                setRound(r => r + 1);
                // TODO: Fetch next word/drawing here
              }}
              autoFocus
            >
              Next Round
            </button>
          </div>
        </div>
      )}

      {/* Footer (optional) */}
      <footer style={{ margin: '32px 0 10px', fontSize: 13, color: '#888' }}>
        <span>Powered by SketchSolo</span>
      </footer>
    </div>
  );
}

export default App;
