import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Canvas from './Canvas';
import DrawingDisplay from './DrawingDisplay';
import ResultModal from './ResultModal';

// Import attached drawings for guess mode
import img1 from './assets/20250704_084811_Screenshot_2025-07-04_at_2.17.38_PM.png';
import img2 from './assets/20250704_084811_Screenshot_2025-07-04_at_2.17.00_PM.png';
import img3 from './assets/20250704_084812_Screenshot_2025-07-04_at_2.16.47_PM.png';
import img4 from './assets/20250704_084813_Screenshot_2025-07-04_at_2.14.38_PM.png';
import img5 from './assets/20250704_084813_bear.png';
import img6 from './assets/20250704_085053_Screenshot_2025-07-04_at_2.20.45_PM.png';
import imgHelicopter from './assets/20250704_090053_Screenshot_2025-07-04_at_2.30.46_PM.png'; // Helicopter image for guess mode

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
  // Score tracks correct and total rounds
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);           // { correct: true/false, msg: string, answer: string }
  const [modalOpen, setModalOpen] = useState(false);

  // === Guess mode mock image array/cycling logic ===
  // List of imported images and associated words for guess mode.
  // The helicopter image is always the first shown in guess mode, so it is easy to check.
  const mockGuessDrawings = useRef([
    // Only include helicopter if file is not a corrupt stub (heuristic: length > 100 for valid React/Webpack PNG)
    ...(typeof imgHelicopter === "string" && imgHelicopter.length > 100
      ? [{ word: 'helicopter', drawingData: imgHelicopter }]
      : []),
    { word: 'lion', drawingData: img1 },
    { word: 'tiger', drawingData: img2 },
    { word: 'house', drawingData: img3 },
    { word: 'waterfall', drawingData: img4 },
    { word: 'bear', drawingData: img5 },
    { word: 'castle', drawingData: img6 }
  ]);
  // Tracks which image to present next (cycles with modulus)
  const guessImageIndex = useRef(0);

  // Game data
  const [currentWord, setCurrentWord] = useState('');           // word to draw, or correct answer for guess mode
  const [currentDrawing, setCurrentDrawing] = useState(null);   // drawing data (imageURL or base64)
  // Word/guess input field: only used in guess mode
  const [guessInput, setGuessInput] = useState("");

  // Effect to enforce chosen theme on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Reset guess input when mode changes or modal opens for new round
  useEffect(() => {
    setGuessInput("");
  }, [mode, round]);

  // PUBLIC_INTERFACE
  /**
   * Toggles between light and dark themes.
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // === WORD AND DRAWING FETCH LOGIC ===

  /**
   * PUBLIC_INTERFACE
   * Simulates fetching a random word for the drawing prompt.
   * Returns a Promise that resolves to a word string after a short delay.
   */
  const fetchRandomWord = async () => {
    const words = [
      "apple", "cat", "house", "rocket", "guitar", "fish", "tree", "sun", "bicycle", "pizza",
      "dog", "car", "book", "moon", "castle", "hat", "elephant", "cup", "star", "shoe"
    ];
    // Simulate network delay:
    await new Promise(resolve => setTimeout(resolve, 360 + Math.random() * 480));
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return randomWord;
  };

  /**
   * PUBLIC_INTERFACE
   * Returns the next image/word from the mockGuessDrawings list, cycling after the last one.
   * Each call advances the index for the next round in guess mode.
   */
  const fetchRandomDrawing = async () => {
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 200));
    const arr = mockGuessDrawings.current;
    if (!Array.isArray(arr) || arr.length === 0) {
      if (window && window.console)
        window.console.warn("[App] Empty mockGuessDrawings array, cannot fetch drawing");
      return { word: "", drawingData: "" };
    }
    const idx = guessImageIndex.current % arr.length;
    const selected = arr[idx];

    if (window && window.console) {
      window.console.log(
        "[App-fetchRandomDrawing] Arr length:", arr.length,
        "idx:", idx, "selected:", selected,
        "drawingData src:", selected && selected.drawingData
      );
    }
    // Advance for next round
    guessImageIndex.current = (guessImageIndex.current + 1) % arr.length;
    return { ...selected };
  };

  // Handler stubs for game logic (expand as needed)
  // PUBLIC_INTERFACE
  /**
   * Starts a new game (all rounds are reset, score returns to zero).
   * @param {string} selectedMode - "draw" or "guess"
   * Resets all round/score state and (for 'guess' mode) resets cycling index.
   */
  const startNewGame = async (selectedMode = 'draw') => {
    setMode(selectedMode);
    setScore({ correct: 0, total: 0 });
    setRound(1);
    setResult(null);
    setError('');
    setModalOpen(false);

    if (selectedMode === 'guess') {
      guessImageIndex.current = 0; // always start at first image
    }

    // Fetch appropriate initial item for the selected mode
    setLoading(true);
    try {
      if (selectedMode === 'draw') {
        const word = await fetchRandomWord();
        setCurrentWord(word);
        setCurrentDrawing(null);
      } else {
        const { word, drawingData } = await fetchRandomDrawing();
        setCurrentWord(word);
        setCurrentDrawing(drawingData && typeof drawingData === "string" ? drawingData : "");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      setCurrentWord('');
      setCurrentDrawing(null);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Call to end the current round and update the score based on result.
   * @param {boolean} isCorrect - Whether the user's round result was correct.
   * @param {string} msg        - Message to display in result modal.
   * @param {string} answer     - The correct answer for display.
   * This function guarantees score updates in lockstep with the UI modal.
   */
  const handleRoundEnd = (isCorrect, msg, answer = '') => {
    setScore(s => ({
      correct: isCorrect ? s.correct + 1 : s.correct,
      total: s.total + 1
    }));
    setResult({ correct: isCorrect, msg, answer });
    setModalOpen(true);
  };

  // Main UI
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

        {/* GamePanel: Render Canvas in draw mode, or DrawingDisplay in guess mode */}
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              {/* Console log handoff for debugging */}
              {(() => {
                if (typeof window !== "undefined" && window.console) {
                  window.console.log("[App->DrawingDisplay] About to pass to DrawingDisplay: currentDrawing:", currentDrawing, "type:", typeof currentDrawing);
                  if (currentDrawing && typeof currentDrawing === "string") {
                    window.console.log("[App->DrawingDisplay] currentDrawing (first 150 chars):", currentDrawing.slice(0,150));
                  }
                }
              })()}
              {/* Drawing Display (guess mode) */}
              <DrawingDisplay
                drawingData={currentDrawing}
                width={340}
                height={220}
                // dev prop for inspection
                debugProps={{
                  round,
                  loading,
                  error,
                  currentDrawing,
                  currentWord
                }}
              />
              {/* Extra on-screen debug: show actual img src and typeof */}
              <div style={{
                fontSize: 12,
                color: "#1258a9",
                marginLeft: 12,
                background: "#e0f3fd",
                border: "1.5px solid #3298d6",
                borderRadius: 4,
                padding: 7,
                fontFamily: "monospace",
                alignSelf: "flex-start",
                maxWidth: 375,
                wordBreak: "break-all"
              }}>
                <strong>IMG src</strong>:<br/>
                {typeof currentDrawing === "string" ? currentDrawing : String(currentDrawing)}
                <br/>
                <strong>typeof</strong>: {typeof currentDrawing}
                <br/>
                <strong>length</strong>: {typeof currentDrawing === "string" && currentDrawing ? currentDrawing.length : 'N/A'}
              </div>
              {(!currentDrawing || typeof currentDrawing !== "string") && (
                <div style={{
                  color: "#d44", background: "#fffaf9", border: "2px dashed #ed6c02", marginTop: 14,
                  fontSize: 13, padding: 7, borderRadius: 5
                }}>
                  [Debug]: No image asset, empty drawingData or bad type. Please check asset pipeline.
                </div>
              )}
            </div>
          )}
        </section>

        {/* InputArea: Prompt/guess input or display word to draw */}
        <section style={{ marginTop: 30 }}>
          <form
            className="input-area"
            aria-label={mode === "draw" ? "Prompt to draw and submit button" : "Guess input and submit button"}
            style={{
              maxWidth: 400,
              margin: "0 auto",
              background: "var(--bg-secondary)",
              borderRadius: 16,
              boxShadow: "0 1px 6px rgba(41,128,185,0.05)",
              padding: "18px 18px 14px 18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              border: "1.5px solid var(--border-color)"
            }}
            onSubmit={e => {
              e.preventDefault();
              // Drawing Mode Submission Logic
              if (mode === "draw") {
                // Ensure a word prompt AND something drawn
                if (!currentWord) {
                  setError("No word to draw!");
                  setResult(null);
                  return;
                }
                if (!currentDrawing) {
                  setError("Please draw something before submitting!");
                  setResult(null);
                  return;
                }
                setError(""); // Reset error on valid submit

                // === MVP stub: App "guesses" user's drawing ===
                // The MVP simulates guessing - future: integrate image recognition/backend
                const isCorrect = Math.random() > 0.45; // About 55% chance "app" says correct
                const feedbackMsg = isCorrect
                  ? "The app thinks it knows what you drew! 🎉"
                  : "Hmm, the app couldn't recognize your drawing this time.";
                handleRoundEnd(isCorrect, feedbackMsg, currentWord);
              }
              // Guess Mode Submission Logic
              else {
                const trimmedGuess = guessInput.trim();
                if (!trimmedGuess) {
                  setError("Please enter your guess!");
                  setResult(null);
                  return;
                }
                setError(""); // Clear any previous error

                // === MVP logic: compare guess to answer (case insensitive) ===
                // For now, currentWord is always the answer (from cycling image list)
                const answer = currentWord || "apple"; // fallback for total stub
                const isCorrect = trimmedGuess.toLowerCase() === answer.toLowerCase();
                const feedbackMsg = isCorrect
                  ? "Great guess!"
                  : "Not quite... Try another drawing!";
                handleRoundEnd(isCorrect, feedbackMsg, answer);
              }
            }}
          >
            {mode === "draw" ? (
              <>
                <div
                  className="prompt"
                  style={{
                    color: "var(--primary)",
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    fontSize: "1.12rem",
                    userSelect: "none"
                  }}
                  aria-label="Your drawing prompt"
                >
                  {currentWord
                    ? <>Draw: <span style={{ color: "var(--accent)" }}>{currentWord}</span></>
                    : <span style={{ color: "var(--text-secondary)" }}>Press "Draw Mode" to get a word!</span>
                  }
                </div>
                <button
                  className="btn"
                  type="submit"
                  aria-label="Submit drawing"
                  style={{ width: "100%", marginTop: 11 }}
                  disabled={!currentWord || !currentDrawing || loading}
                >
                  Submit Drawing
                </button>
              </>
            ) : (
              <>
                <label htmlFor="guess-input" style={{ color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>
                  Your Guess:
                </label>
                <input
                  id="guess-input"
                  name="guess"
                  type="text"
                  autoComplete="off"
                  value={guessInput}
                  onChange={e => setGuessInput(e.target.value)}
                  aria-label="Enter your guess"
                  placeholder="Type the word..."
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    fontSize: "1.08rem",
                    border: "1.5px solid var(--border-color)",
                    borderRadius: 7,
                    outline: "none",
                    marginBottom: 0,
                    background: "#fff",
                    color: "var(--text-primary)",
                    boxSizing: "border-box"
                  }}
                  autoFocus
                  required
                />
                <button
                  className="btn"
                  type="submit"
                  aria-label="Submit guess"
                  style={{ width: "100%", marginTop: 7 }}
                  disabled={!guessInput.trim() || loading}
                >
                  Submit Guess
                </button>
              </>
            )}
          </form>
        </section>
      </main>

      {/* Result Modal */}
      <ResultModal
        open={modalOpen}
        result={result}
        onClose={() => setModalOpen(false)}
        onNext={async () => {
          // Proceed to the next round:
          setModalOpen(false);
          setResult(null);
          setRound(r => r + 1); // increment round

          // Fetch next word/drawing for new round
          setLoading(true);
          try {
            if (mode === "draw") {
              const word = await fetchRandomWord();
              setCurrentWord(word);
              setCurrentDrawing(null);
            } else {
              const { word, drawingData } = await fetchRandomDrawing();
              setCurrentWord(word);
              setCurrentDrawing(drawingData && typeof drawingData === "string" ? drawingData : "");
            }
          } catch (err) {
            setError("Failed to fetch next round data.");
            setCurrentWord('');
            setCurrentDrawing(null);
          } finally {
            setLoading(false);
          }
        }}
      />

      {/* Footer (optional) */}
      <footer style={{ margin: '32px 0 10px', fontSize: 13, color: '#888' }}>
        <span>Powered by SketchSolo</span>
      </footer>
    </div>
  );
}

export default App;
