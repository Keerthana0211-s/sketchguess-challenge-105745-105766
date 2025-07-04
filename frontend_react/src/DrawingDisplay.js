import React from "react";

/**
 * PUBLIC_INTERFACE
 * DrawingDisplay component for SketchSolo Guess Mode.
 * 
 * Shows the drawing to be guessed as an image, or a clear placeholder if there is no drawing.
 * Ensures accessibility (role="img", alt text) and a modern minimal style per brand with fallback UI.
 * 
 * Props:
 *   drawingData: string | null   // Base64 image string (data URL), or null/undefined for placeholder
 *   width: number                // Pixel width (optional, default 340)
 *   height: number               // Pixel height (optional, default 220)
 */
function DrawingDisplay({ drawingData, width = 340, height = 220 }) {
  // Helper: Interpret when data may be present but invalid (empty string, wrong format, etc.)
  const isValidImageData = (data) =>
    typeof data === "string" &&
    data.startsWith("data:image") &&
    data.length > "data:image/png;base64,".length + 10; // crude size check

  return (
    <div
      className="drawing-display-container"
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-secondary)",
        border: "2.5px solid var(--primary)",
        borderRadius: 14,
        boxShadow: "0 1px 8px rgba(41,128,185,0.08)"
      }}
      aria-label={isValidImageData(drawingData) ? "Drawing to guess" : "No drawing available"}
    >
      {isValidImageData(drawingData) ? (
        <img
          src={drawingData}
          alt="Drawing to guess"
          style={{
            width: "96%",
            height: "96%",
            objectFit: "contain",
            borderRadius: 9,
            boxShadow: "0 0.5px 4px rgba(41,128,185,0.06)"
          }}
        />
      ) : (
        <div
          style={{
            color: "#bbb",
            textAlign: "center",
            fontSize: 22,
            width: "94%",
            userSelect: "none"
          }}
          data-debug={drawingData === null ? "null" : typeof drawingData + (drawingData ? " | present" : " | empty")}
        >
          <span role="img" aria-label="Empty drawing">🖼️</span>
          <div style={{fontSize: 15, marginTop: 9}}>
            No drawing available<br />
            {drawingData === "" && <span>(Empty image)</span>}
            {drawingData && typeof drawingData === "string" && !isValidImageData(drawingData) && (
              <span style={{color:"#c44"}}>(Invalid image format!)</span>
            )}
            <span style={{fontSize: 11, display: "block", marginTop: 3, color: "#aaa"}}>
              {/* Debug info: if drawingData present, show first N chars */}
              {drawingData && typeof drawingData === "string"
                ? "Got data: " + drawingData.substring(0, 24) + (drawingData.length > 24 ? "..." : "")
                : ""}
            </span>
            <span>
              Start a round to see a drawing!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrawingDisplay;
