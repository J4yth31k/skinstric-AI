import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CameraPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("loading"); // "loading" | "streaming" | "captured"
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => setStatus("streaming");
        }
      })
      .catch(() => navigate("/upload-choice"));
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Resize to max 800px wide so the image stays under API/storage limits
    const MAX = 800;
    const ratio = Math.min(MAX / video.videoWidth, MAX / video.videoHeight, 1);
    canvas.width = Math.round(video.videoWidth * ratio);
    canvas.height = Math.round(video.videoHeight * ratio);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    setCaptured(dataUrl);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStatus("captured");
  };

  const proceed = () => {
    if (!captured) return;
    sessionStorage.setItem("skinstric_image", captured);
    navigate("/analysis/preparing");
  };

  // Slide 011 — Setting up camera
  if (status === "loading") {
    return (
      <div style={ls.screen}>
        <div style={ls.center}>
          <div style={ls.diamond}>
            <div style={ls.inner}>
              <ApertureIcon size={64} />
              <span style={ls.loadingText}>SETTING UP CAMERA ...</span>
            </div>
          </div>
        </div>
        <div style={ls.tips}>
          <span style={ls.tipsLabel}>TO GET BETTER RESULTS MAKE SURE TO HAVE:</span>
          <div style={ls.tipsList}>
            {["NEUTRAL EXPRESSION", "FRONTAL POSE", "ADEQUATE LIGHTING"].map((t) => (
              <span key={t} style={ls.tip}>◇ {t}</span>
            ))}
          </div>
        </div>
        <video ref={videoRef} autoPlay playsInline muted style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    );
  }

  // Slide 012/013 — Streaming or captured
  return (
    <div style={ds.screen}>
      <header style={ds.header}>
        <div style={ds.hl}>
          <span style={ds.brand}>SKINSTRIC</span>
          {status === "captured" && <span style={ds.tag}>[ ANALYSIS ]</span>}
        </div>
      </header>

      <div style={ds.videoWrap}>
        {status === "captured" ? (
          <img src={captured} alt="captured" style={ds.feed} />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={ds.feed} />
        )}

        {status === "streaming" && (
          <button style={ds.captureBtn} onClick={takePicture} aria-label="Take picture">
            <div style={ds.captureInner} />
          </button>
        )}

        <div style={ds.tips}>
          <span style={ds.tipsLabel}>TO GET BETTER RESULTS MAKE SURE TO HAVE:</span>
          <div style={ds.tipsList}>
            {["NEUTRAL EXPRESSION", "FRONTAL POSE", "ADEQUATE LIGHTING"].map((t) => (
              <span key={t} style={ds.tip}>◇ {t}</span>
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {status === "captured" && (
        <nav style={ds.nav}>
          <button style={ds.backBtn} onClick={() => navigate("/upload-choice")}>
            <NavDiamond dir="left" /><span>BACK</span>
          </button>
          <button style={ds.proceedBtn} onClick={proceed}>
            <span>PROCEED</span><NavDiamond />
          </button>
        </nav>
      )}
    </div>
  );
}

function ApertureIcon({ size = 64 }) {
  const c = size / 2;
  const r = size * 0.44;
  const ir = r * 0.38;
  const blades = 6;
  const paths = Array.from({ length: blades }, (_, i) => {
    const a1 = ((i * 360) / blades) * (Math.PI / 180);
    const a2 = (((i + 1) * 360) / blades) * (Math.PI / 180);
    const offset = (30 * Math.PI) / 180;
    const x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1);
    const x2 = c + r * Math.cos(a2), y2 = c + r * Math.sin(a2);
    const x3 = c + ir * Math.cos(a2 + offset), y3 = c + ir * Math.sin(a2 + offset);
    const x4 = c + ir * Math.cos(a1 + offset), y4 = c + ir * Math.sin(a1 + offset);
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4}Z`;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={c} cy={c} r={r} stroke="#1a1b1c" strokeWidth="1.5" />
      {paths.map((d, i) => <path key={i} d={d} fill="#1a1b1c" />)}
      <circle cx={c} cy={c} r={ir * 0.55} fill="#fcfcfc" />
    </svg>
  );
}

function NavDiamond({ dir }) {
  return (
    <span style={{ display: "inline-block", width: 20, height: 20, border: "1.5px solid #fcfcfc", transform: "rotate(45deg)", position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontSize: 9, color: "#fcfcfc", lineHeight: 1 }}>
        {dir === "left" ? "←" : "→"}
      </span>
    </span>
  );
}

// Loading state styles (white background)
const ls = {
  screen: { background: "#fcfcfc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Inter',sans-serif", border: "1px solid #1a1b1c", position: "relative" },
  center: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  diamond: { width: 200, height: 200, transform: "rotate(45deg)", border: "1px dashed rgba(26,27,28,0.25)", display: "flex", alignItems: "center", justifyContent: "center" },
  inner: { transform: "rotate(-45deg)", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" },
  loadingText: { fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  tips: { padding: "20px 0 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  tipsLabel: { fontSize: 8, letterSpacing: "0.1em", color: "rgba(26,27,28,0.4)", textTransform: "uppercase" },
  tipsList: { display: "flex", gap: 24 },
  tip: { fontSize: 8, letterSpacing: "0.1em", color: "rgba(26,27,28,0.35)", textTransform: "uppercase" },
};

// Streaming/captured state styles (dark background)
const ds = {
  screen: { background: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", color: "#fcfcfc", position: "relative" },
  header: { position: "absolute", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", padding: "0 28px", height: 48, zIndex: 10 },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc" },
  tag: { fontSize: 11, color: "rgba(252,252,252,0.5)", letterSpacing: "0.06em" },
  videoWrap: { flex: 1, position: "relative", minHeight: "100vh", overflow: "hidden" },
  feed: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  captureBtn: { position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(252,252,252,0.8)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 },
  captureInner: { width: 40, height: 40, borderRadius: "50%", background: "rgba(252,252,252,0.9)" },
  tips: { position: "absolute", bottom: 56, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 },
  tipsLabel: { fontSize: 8, letterSpacing: "0.1em", color: "rgba(252,252,252,0.5)", textTransform: "uppercase" },
  tipsList: { display: "flex", gap: 24 },
  tip: { fontSize: 8, letterSpacing: "0.1em", color: "rgba(252,252,252,0.4)", textTransform: "uppercase" },
  nav: { position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", zIndex: 10 },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(252,252,252,0.6)", textTransform: "uppercase" },
  proceedBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc", textTransform: "uppercase" },
};
