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
  // Helper: Accepts Webpack-provided static asset URLs (e.g. /static/media/...), paths, or data URLs
  const isValidImageData = (data) =>
    typeof data === "string" &&
    !!data &&
    (
      // Accept Webpack static asset URLs (start with /static/, ./, or assets/, etc.)
      /^(\.\/|\/?static\/|\/?assets\/).+\.(png|jpg|jpeg|gif|svg)$/i.test(data) ||
      // Accept compiled Create React App "/static/media/..." URLs
      /^\/static\/media\/.+\.(png|jpg|jpeg|gif|svg)(\?hash=[a-zA-Z0-9]+)?$/i.test(data) ||
      // Accept data URLs (canvas export)
      data.startsWith("data:image/")
    );

  // Always log for debugging and show visually
  if (typeof window !== "undefined" && window.console) {
    console.log(
      "[DEBUG-DrawingDisplay] drawingData:",
      drawingData,
      "type:", typeof drawingData,
      "length:", drawingData && typeof drawingData === "string" ? drawingData.length : undefined,
      "valid:", isValidImageData(drawingData),
      "src:", drawingData,
      "extra debugProps:", debugProps
    );
  }

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
        border: "4px solid #f39c12", // accent border for debug tracing
        borderRadius: 14,
        boxShadow: "0 1px 8px rgba(41,128,185,0.15)",
        position: "relative",
        outline: (isValidImageData(drawingData) ? "2.5px solid #27ae60" : "2.5px dashed #b04141"),
        boxSizing: "border-box"
      }}
      aria-label={isValidImageData(drawingData) ? "Drawing to guess" : "No drawing available"}
      data-debug-src={drawingData && typeof drawingData === "string" ? drawingData.slice(0,20)+'...' : "null"}
    >
      {/* On-screen debug info for guess mode */}
      {debugProps && (
        <div style={{
          position: "absolute",
          left: 8, top: 3, fontSize: 12, color: "#b04", opacity: 0.87,
          zIndex: 3, fontFamily: "monospace", pointerEvents: "none", maxWidth: 420, wordBreak: "break-word", lineHeight: 1.14,
          background: "#fffbe8", border: "1.5px solid #f39c12", borderRadius: 3, padding: 6
        }}>
          <div style={{fontWeight:900, fontSize:13, color:"#e87a41"}}>DEBUG</div>
          round: {debugProps.round} <br/>
          loading: {debugProps.loading ? "T" : "F"} <br/>
          error: {debugProps.error ? debugProps.error : "-"} <br/>
          drawingData: {typeof drawingData === "string" ? `[${drawingData.slice(0,32)}${drawingData.length>32?"...":""}]` : String(drawingData)} <br/>
          currentDrawing: {debugProps.currentDrawing && typeof debugProps.currentDrawing === "string"
            ? `[len:${debugProps.currentDrawing.length}]`
            : String(debugProps.currentDrawing)} <br/>
          currentWord: {String(debugProps.currentWord)} <br/>
          validImg: {isValidImageData(drawingData) ? "yes" : "no"} <br/>
          <span style={{fontSize:10, color:"#630"}}>
            img src: {typeof drawingData === "string" ? drawingData : "(not a string)"}
          </span>
        </div>
      )}
      {isValidImageData(drawingData) ? (
        <>
          <img
            src={drawingData}
            alt="Drawing to guess"
            data-debug="guess-image"
            style={{
              width: "96%",
              height: "96%",
              objectFit: "contain",
              borderRadius: 11,
              boxShadow: "0 0.5px 8px 2px #f39c12, 0 0.5px 4px rgba(41,128,185,0.10)", // shadow for visibility
              zIndex: 2,
              outline: "2.5px solid #27ae60"
            }}
            onError={e => {
              e.target.style.opacity = 0.39;
              e.target.style.border = "2.5px dashed #e74c3c";
              e.target.alt = "Image failed to load";
              e.target.parentNode && (e.target.parentNode.style.background="#fff4f3");
              if (window && window.console) window.console.error("[DrawingDisplay] Failed image load", drawingData);
            }}
          />
          <div style={{ fontSize: 12, marginTop: 6, color: "#ad730a", wordBreak: "break-all", opacity: 0.92 }}>
            <strong>src:</strong>{" "}
            <span style={{color:"#2980b9"}}>
              {typeof drawingData === "string"
                ? drawingData.slice(0, 128) + (drawingData.length > 128 ? "..." : "")
                : "(not a string)"}
            </span>
            <br />
            <span>valid: {isValidImageData(drawingData) ? "yes" : "no"}</span>
          </div>
        </>
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
              {drawingData && typeof drawingData === "string"
                ? "Got data: " + drawingData.substring(0, 24) + (drawingData.length > 24 ? "..." : "")
                : ""}
            </span>
            <span>
              Start a round to see a drawing!
            </span>
            <div style={{ fontSize: 11, color: "#741", marginTop: 7 }}>
              <strong>src:</strong> {typeof drawingData === "string" ? drawingData : "(not a string)"}<br/>
              <span>valid: {isValidImageData(drawingData) ? "yes" : "no"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrawingDisplay;
