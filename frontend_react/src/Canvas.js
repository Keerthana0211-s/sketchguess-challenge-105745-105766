import React, { useRef, useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Drawing canvas for SketchSolo
 * Allows users to draw with mouse/touch and clear the canvas.
 * Props:
 *   disabled: boolean (canvas is not interactive if true)
 *   width: number (pixels, CSS width)
 *   height: number (pixels, CSS height)
 *   onChange: fn (called when drawing changes with the data URL)
 */
function Canvas({ disabled = false, width = 340, height = 220, onChange = () => {} }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  // Returns true if canvas is empty
  const isCanvasBlank = () => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext("2d");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return !Array.from(pixels).some((channel, idx) => idx % 4 === 3 && channel !== 0);
  };

  // PUBLIC_INTERFACE
  /** Clears the canvas. */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setLastPoint(null);
      onChange(null);
    }
  };

  // Mouse/touch event handlers
  const startDrawing = (point) => {
    if (disabled) return;
    setDrawing(true);
    setLastPoint(point);
  };

  const drawMove = (point) => {
    if (!drawing || disabled) return;
    const canvas = canvasRef.current;
    if (!canvas || !lastPoint) return;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#2980b9";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    setLastPoint(point);
  };

  const endDrawing = () => {
    if (drawing && canvasRef.current) {
      onChange(canvasRef.current.toDataURL());
    }
    setDrawing(false);
    setLastPoint(null);
  };

  // Mouse
  const handlePointerDown = (e) => {
    if (disabled) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches.length) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    startDrawing({ x, y });
  };
  const handlePointerMove = (e) => {
    if (!drawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;
    if (e.touches && e.touches.length) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }
    drawMove({ x, y });
  };

  // Double tap/click to clear
  let lastTap = useRef(0);
  const handleDoubleTap = (e) => {
    if (disabled) return;
    e.preventDefault();
    clearCanvas();
  };
  const handleTouchStart = (e) => {
    const now = Date.now();
    if (now - lastTap.current < 350) {
      handleDoubleTap(e);
    }
    lastTap.current = now;
    handlePointerDown(e);
  };

  // Accessibility: ESC clears the drawing if focused
  const handleKeyDown = (e) => {
    if ((e.key === "Escape" || e.key === "Esc") && !disabled) {
      clearCanvas();
    }
  };

  // Prevent scrolling on touch drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prevent = (e) => e.preventDefault();
    canvas.addEventListener("touchmove", prevent, { passive: false });
    return () => canvas.removeEventListener("touchmove", prevent);
  }, []);

  // Expose isBlank for parent logic (if needed)
  useEffect(() => {
    if (onChange) {
      onChange(isCanvasBlank() ? null : canvasRef.current.toDataURL());
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="drawing-canvas-container" tabIndex={0} onKeyDown={handleKeyDown}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`drawing-canvas${disabled ? " disabled" : ""}`}
        style={{
          width: width,
          height: height,
          background: "#fff",
          border: "2.5px solid var(--primary)",
          borderRadius: 14,
          boxShadow: "0 1px 8px rgba(41,128,185,0.09)"
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={handleTouchStart}
        onTouchMove={handlePointerMove}
        onTouchEnd={endDrawing}
        aria-label={disabled ? "Drawing canvas (disabled)" : "Drawing canvas"}
        tabIndex={0}
      />
      <div className="canvas-hint" style={{
        fontSize: 13,
        color: "var(--text-secondary)",
        marginTop: 5,
        userSelect: "none"
      }}>
        {disabled
          ? "Canvas will be enabled when it's your turn to draw."
          : "Tip: Double tap/click or hit ESC to clear."}
      </div>
    </div>
  );
}

export default Canvas;
