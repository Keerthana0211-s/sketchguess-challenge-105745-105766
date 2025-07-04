import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './Canvas';
import DrawingDisplay from './DrawingDisplay';
import ResultModal from './ResultModal';

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

  // === STUB/ASYNC MOCKS FOR WORD & DRAWING FETCHING ===

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
   * Simulates fetching a random drawing with its associated word.
   * Returns a Promise that resolves to { drawingData, word } after a short delay.
   * (For now: returns a hardcoded drawing for "apple", extendable for more samples.)
   */
  const fetchRandomDrawing = async () => {
    // Array of dummy drawing assets. (Data URLs could also be fetched from a local list/assets).
    const sampleDrawings = [
      // Example: a simple base64 PNG for "apple", more can be added as string URLs or imported data.
      {
        word: "apple",
        drawingData:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAB0CAYAAABaypQaAAABt0lEQVR42u3aoQ2AMBAF0e//5y0YkwuT8hQUkONkELWod93/CoFBoFA9X6/Uaj0ej0Wh0OhQKBQKBr6Z12/pdrutAhQAQAAAAAAAIBytyf80Q7bMY1wZDEpzk+xZPfZ/pn2nZnUZjUZXfmjlL2Ccx4/vggW/LZXK/vKqqiPx2xVL71GGovzG9wJ3/RZOdfi7XVQ9BjitUOtb8VacCTv7trFrDyuqCclUk6Q8u1QrFncvSkAl/5uA9XameTSkCXzlwDd9k9OGyQ/x5nK6pL6rhvK1wFYpXyjmig3A6YAs7VEvueEtP2Zcrnz4VbS4AtV7CEAAAAAAAAAQD79Ba4OlTH96e1tAAAAAElFTkSuQmCC"
      },
      {
        word: "cat",
        drawingData:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAB0CAYAAABaypQaAAAA/UlEQVR42u3VsQ2AIBDEQQn++4nKV1CETQCwlao78O0Ifb5uAoAAAAAAAAAACuTG/jb1VvTwGAkQHDtSdD9vOCHkXyK+mB8ZrxFaQTVlNd+ukR27QT+OmRLXwToTJrHgCjAeHEQDaxHk4hbEOEAJaAOENEAOEAJaAOENEAOEAJaAOENEAOEAJaAOENEAOEAJaAOENEAOEAJaAOENEAOEAJaAOEMQASHgHufJC8TFI6YAAAAASUVORK5CYII="
      },
      {
        word: "sun",
        drawingData:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAB0CAYAAABaypQaAAABCklEQVR42u3QQREAIAwAMdn/Uz+hdZaIzyNlaZFxd390CN+CgAAAAAAAAAAAAAAAPA+HWl3Cm5zjsjtH0e37CxThwnw+6nPBGfgN+4AfAIdgi+gjHrd6zjTIyAfKAX0IzAF+Qk8AHygF9CEwBfkIPAB8oBfQhMAX5CDwAfKAUU4MfoX7d2MTeyZXiP0AAAAASUVORK5CYII="
      },
      // Add more dummy drawings here as needed...
    ];
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 500));
    const sample = sampleDrawings[Math.floor(Math.random() * sampleDrawings.length)];
    console.log("[DEBUG-fetchRandomDrawing] Returning sample:", sample);
    return sample;
  };

  // Handler stubs for game logic (expand as needed)
  // PUBLIC_INTERFACE
  /**
   * Starts a new game (all rounds are reset, score returns to zero).
   * @param {string} selectedMode - "draw" or "guess"
   * Resets all round/score state.
   */
  const startNewGame = async (selectedMode = 'draw') => {
    setMode(selectedMode);
    setScore({ correct: 0, total: 0 });
    setRound(1);
    setResult(null);
    setError('');
    setModalOpen(false);

    // Fetch appropriate initial item for the selected mode
    setLoading(true);
    try {
      if (selectedMode === 'draw') {
        const word = await fetchRandomWord();
        setCurrentWord(word);
        setCurrentDrawing(null);
      } else {
        const { word, drawingData } = await fetchRandomDrawing();
        setCurrentWord(word); // For validation
        // Defensive: Fallback to empty string if drawingData is somehow missing.
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
              {/* Drawing Display (guess mode) */}
              {console.log("[DEBUG-App] Guess mode render:", {currentDrawing, currentWord, round, loading, error})}
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
                // Optionally: clear or keep drawing until next round.
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
                // For now, currentWord is always the answer (from stub)
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
