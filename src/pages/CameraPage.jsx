import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CameraPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [captured, setCaptured] = useState(null);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCaptured(dataUrl);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const proceed = () => {
    if (!captured) return;
    sessionStorage.setItem("skinstric_image", captured);
    navigate("/preparing");
  };

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.hl}>
          <span style={s.brand}>SKINSTRIC</span>
          {captured && <span style={s.tag}>[ ANALYSIS ]</span>}
        </div>
      </header>

      <div style={s.videoWrap}>
        {captured ? (
          <img src={captured} alt="captured" style={s.feed} />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={s.feed} />
        )}

        {!captured && (
          <button style={s.captureBtn} onClick={takePicture} aria-label="Take picture">
            <div style={s.captureInner} />
          </button>
        )}

        <div style={s.tips}>
          <span style={s.tipsLabel}>TO GET BETTER RESULTS MAKE SURE TO HAVE:</span>
          <div style={s.tipsList}>
            {["NEUTRAL EXPRESSION", "FRONTAL POSE", "ADEQUATE LIGHTING"].map((t) => (
              <span key={t} style={s.tip}>◇ {t}</span>
            ))}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {captured && (
        <nav style={s.nav}>
          <button style={s.backBtn} onClick={() => { setCaptured(null); navigate("/upload-choice"); }}>
            <NavDiamond dir="left" /><span>BACK</span>
          </button>
          <button style={s.proceedBtn} onClick={proceed}>
            <span>PROCEED</span><NavDiamond />
          </button>
        </nav>
      )}
    </div>
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

const s = {
  screen: { background: "#000", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", color: "#fcfcfc" },
  header: { display: "flex", alignItems: "center", padding: "0 28px", height: 48, position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc" },
  tag: { fontSize: 11, color: "rgba(252,252,252,0.5)", letterSpacing: "0.06em" },
  videoWrap: { flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  feed: { width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 },
  captureBtn: { position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(252,252,252,0.8)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 },
  captureInner: { width: 40, height: 40, borderRadius: "50%", background: "rgba(252,252,252,0.9)" },
  tips: { position: "absolute", bottom: 56, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, zIndex: 10 },
  tipsLabel: { fontSize: 9, letterSpacing: "0.1em", color: "rgba(252,252,252,0.6)", textTransform: "uppercase" },
  tipsList: { display: "flex", gap: 24 },
  tip: { fontSize: 9, letterSpacing: "0.1em", color: "rgba(252,252,252,0.5)", textTransform: "uppercase" },
  nav: { position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", zIndex: 10 },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(252,252,252,0.6)", textTransform: "uppercase" },
  proceedBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc", textTransform: "uppercase" },
};
