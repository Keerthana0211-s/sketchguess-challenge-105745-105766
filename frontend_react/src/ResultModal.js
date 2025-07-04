import React from "react";

/**
 * PUBLIC_INTERFACE
 * ResultModal for SketchSolo game round feedback.
 * Displays whether the answer was correct, the correct answer (if needed), a feedback message,
 * and provides a button to proceed to the next round.
 * 
 * Props:
 * - open: boolean            // Whether the modal is visible
 * - result: object|null      // { correct: boolean, msg: string, answer: string }
 * - onNext: fn               // Callback for "Next Round" action
 * - onClose: fn              // Callback to close the modal (e.g., clicking overlay)
 */
function ResultModal({ open, result, onNext, onClose }) {
  // Focus trap for accessibility
  // Simple approach: focus Next btn when modal mounts
  const nextBtnRef = React.useRef();

  React.useEffect(() => {
    if (nextBtnRef.current) {
      nextBtnRef.current.focus();
    }
  }, [open]);

  if (!open || !result) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-modal-title"
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
      onClick={onClose}
      tabIndex={-1}
      data-testid="result-modal-overlay"
    >
      <div
        className="modal-content"
        style={{
          background: 'var(--bg-primary)',
          borderRadius: 20,
          padding: '2rem 2.5rem',
          minWidth: 320,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          textAlign: 'center',
          outline: 'none'
        }}
        onClick={e => e.stopPropagation()}
        tabIndex={0}
        aria-describedby="result-modal-feedback"
      >
        <h2
          id="result-modal-title"
          style={{
            color: result.correct ? '#27ae60' : '#2980b9',
            marginBottom: 15
          }}
        >
          {result.correct ? "🎉 Correct!" : "❌ Try Again!"}
        </h2>
        <div id="result-modal-feedback" style={{ marginBottom: 10 }}>
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
          onClick={onNext}
          ref={nextBtnRef}
          aria-label="Start next round"
        >
          Next Round
        </button>
      </div>
    </div>
  );
}

export default ResultModal;
