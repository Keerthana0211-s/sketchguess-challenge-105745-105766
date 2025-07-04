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
function DrawingDisplay({ drawingData, width = 340, height = 220, debugProps }) {
  // Helper: Interpret when data may be present but invalid (empty string, wrong format, etc.)
  // Accepts any valid Webpack-provided static asset path or data URL as valid image source
  const isValidImageData = (data) =>
    typeof data === "string" &&
    !!data &&
    (
      // Accept Webpack static asset URLs (start with /static/, ./, or assets/, etc.)
      /^\.?\/?(static|assets)?\/.+\.(png|jpg|jpeg|gif|svg)$/i.test(data) ||
      // Accept data URLs (canvas export)
      data.startsWith("data:image/")
    );

  // Dev: print/log all critical info each render to console and visually (in guess mode)
  // Show exact image src path for diagnosis
  console.log("[DEBUG-DrawingDisplay] drawingData snippet:", drawingData ? drawingData.substring(0, 95)+"..." : drawingData, 
    "type:", typeof drawingData,
    "valid:", isValidImageData(drawingData),
    "src:", drawingData,
    "extra debugProps:", debugProps);

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
        boxShadow: "0 1px 8px rgba(41,128,185,0.08)",
        position: "relative"
      }}
      aria-label={isValidImageData(drawingData) ? "Drawing to guess" : "No drawing available"}
    >
      {/* On-screen debug info for guess mode */}
      {debugProps && (
        <div style={{
          position: "absolute",
          left: 8, top: 3, fontSize: 11, color: "#b04", opacity: 0.72,
          zIndex: 2, fontFamily: "monospace", pointerEvents: "none", maxWidth: 300, wordBreak: "break-word", lineHeight: 1.12
        }}>
          <div style={{fontWeight:700}}>DEBUG</div>
          round: {debugProps.round} <br/>
          loading: {debugProps.loading ? "T" : "F"} <br/>
          error: {debugProps.error ? debugProps.error : "-"} <br/>
          currentDrawing {debugProps.currentDrawing ? 
            `[len: ${debugProps.currentDrawing.length}]` : "null/empty"} <br/>
          currentWord: {String(debugProps.currentWord)}<br />
          validImg: {isValidImageData(debugProps.currentDrawing) ? "yes" : "no"} <br/>
          <span style={{fontSize:10, color:"#630"}}>
            img src: {typeof debugProps.currentDrawing === "string" ? debugProps.currentDrawing : "(not a string)"}
          </span>
        </div>
      )}
      {isValidImageData(drawingData) ? (
        <img
          src={drawingData}
          alt="Drawing to guess"
          style={{
            width: "96%",
            height: "96%",
            objectFit: "contain",
            borderRadius: 9,
            boxShadow: "0 0.5px 4px rgba(41,128,185,0.06)",
            zIndex: 1
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
