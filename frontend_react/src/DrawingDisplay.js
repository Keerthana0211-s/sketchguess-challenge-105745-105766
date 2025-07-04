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
      data.startsWith("data:image/") ||
      // Accept localhost relative paths (useful for dev asset src in create-react-app)
      /^\/assets\/.+\.(png|jpg|jpeg|gif|svg)$/i.test(data)
    );

  // Enhanced debug for troubleshooting image source issue
  if (typeof window !== "undefined" && window.console) {
    // eslint-disable-next-line
    console.log(
      "[DEBUG-DrawingDisplay-FULL] drawingData:", drawingData,
      "\n - type:", typeof drawingData,
      "\n - length:", drawingData && typeof drawingData === "string" ? drawingData.length : undefined,
      "\n - isValidImageData:", isValidImageData(drawingData),
      "\n - src (for <img>):", drawingData,
      "\n - debugProps:", debugProps,
      "\n - window.location:", window && window.location ? window.location.href : undefined
    );
    if (debugProps && typeof drawingData === "string" && !isValidImageData(drawingData)) {
      window.console.warn("[DrawingDisplay] Image src not recognized as valid image, check pipeline and asset delivery:", drawingData);
    }
  }

  // Show full prop dump and data overlay for debugging
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
        border: "4px solid #f39c12",
        borderRadius: 14,
        boxShadow: "0 1px 8px rgba(41,128,185,0.15)",
        position: "relative",
        outline: (isValidImageData(drawingData) ? "2.5px solid #27ae60" : "2.5px dashed #b04141"),
        boxSizing: "border-box"
      }}
      aria-label={isValidImageData(drawingData) ? "Drawing to guess" : "No drawing available"}
      data-debug-src={drawingData && typeof drawingData === "string" ? drawingData.slice(0,40)+'...' : "null"}
    >
      {/* Dev/Debug: WIDER Property Dump + actual src display for diagnosis */}
      <div style={{
        position: "absolute",
        left: 8, top: 3, fontSize: 12, color: "#1e36ad", background: "#fff4c6", border: "1.3px solid #ded0a6",
        zIndex: 30, fontFamily: "monospace", pointerEvents: "none", maxWidth: 495, wordBreak: "break-all", lineHeight: 1.15,
        borderRadius: 5, padding: 7, opacity: 0.98, boxShadow: "0 2px 7px #dbe6f8"
      }}>
        <strong>DrawDisp Debug</strong> <br />
        <span>drawData type: <b>{typeof drawingData}</b> &nbsp; | &nbsp; len: <b>{drawingData && typeof drawingData === "string" ? drawingData.length : "N/A"}</b></span><br />
        <span>img src:<br />
          <span style={{ color:"#2732af", wordBreak:"break-all", fontSize:"12px"}}>
            {typeof drawingData === "string"
              ? drawingData.slice(0, 320) + (drawingData.length > 320 ? "...(trunc)" : "")
              : String(drawingData)}
          </span>
        </span>
        <br />
        <span>isValidImg: <b>{isValidImageData(drawingData) ? "yes" : "no"}</b></span><br />
        <span>window.loc:
          <span style={{ color:"#438" }}>
            {typeof window !== "undefined" && window.location ? ` ${window.location.pathname}` : ""}
          </span>
        </span>
        <br/>
        <span>Other props:<br/>
          {JSON.stringify(debugProps)}
        </span>
      </div>
      {/* On-screen original debug info */}
      {debugProps && (
        <div style={{
          position: "absolute",
          right: 8, bottom: 3, fontSize: 12, color: "#b04", opacity: 0.87,
          zIndex: 3, fontFamily: "monospace", pointerEvents: "none", maxWidth: 320, wordBreak: "break-word", lineHeight: 1.14,
          background: "#fffbe8", border: "1.5px solid #f39c12", borderRadius: 3, padding: 4
        }}>
          <div style={{fontWeight:900, fontSize:13, color:"#e87a41"}}>DEBUG</div>
          round: {debugProps.round} <br/>
          loading: {debugProps.loading ? "T" : "F"} <br/>
          error: {debugProps.error ? debugProps.error : "-"} <br/>
          drawData: {typeof drawingData === "string" ? `[${drawingData.slice(0,32)}${drawingData.length>32?"...":""}]` : String(drawingData)} <br/>
          currentDrawing: {debugProps.currentDrawing && typeof debugProps.currentDrawing === "string"
            ? `[len:${debugProps.currentDrawing.length}]`
            : String(debugProps.currentDrawing)} <br/>
          currentWord: {String(debugProps.currentWord)} <br/>
          validImg: {isValidImageData(drawingData) ? "yes" : "no"} <br/>
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
              boxShadow: "0 0.5px 8px 2px #f39c12, 0 0.5px 4px rgba(41,128,185,0.10)",
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
