import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LocationPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState(() => localStorage.getItem("skinstric_location") || "");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const proceed = () => {
    const trimmed = location.trim();
    if (!trimmed) return;
    localStorage.setItem("skinstric_location", trimmed);
    navigate("/upload-choice");
  };

  return (
    <div style={s.screen} className="intro-screen" onClick={() => inputRef.current?.focus()}>
      <style>{`#location-input::placeholder { color: rgba(26,27,28,0.35); font-weight: 300; }`}</style>

      <header style={s.header} onClick={(e) => e.stopPropagation()}>
        <div style={s.hl}>
          <span style={s.brand}>SKINSTRIC</span>
          <span style={s.tag}>[ INTRO ]</span>
        </div>
      </header>

      <main style={s.body}>
        <p style={s.startLabel}>TO START ANALYSIS</p>

        <div style={s.diamond} className="intro-diamond">
          <div style={s.inner}>
            {location
              ? <span style={s.activeLabel}>WHERE ARE YOU FROM?</span>
              : <span style={s.clickLabel}>CLICK TO TYPE</span>
            }
            <input
              id="location-input"
              ref={inputRef}
              value={location}
              placeholder="Where are you from?"
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && proceed()}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: location ? "1.5px solid #1a1b1c" : "none",
                outline: "none",
                fontSize: 28,
                fontWeight: 300,
                color: "#1a1b1c",
                fontFamily: "'DM Sans','Inter',sans-serif",
                textAlign: "center",
                width: 210,
                caretColor: "#1a1b1c",
                letterSpacing: "-0.01em",
                padding: "0 0 2px 0",
              }}
            />
          </div>
        </div>
      </main>

      <nav style={s.nav} onClick={(e) => e.stopPropagation()}>
        <button style={s.backBtn} onClick={() => navigate("/intro")}>
          <NavDiamond dir="left" /><span>BACK</span>
        </button>
        {location.trim() && (
          <button style={s.proceedBtn} onClick={proceed}>
            <span>PROCEED</span><NavDiamond />
          </button>
        )}
      </nav>
    </div>
  );
}

function NavDiamond({ dir }) {
  return (
    <span style={{ display: "inline-block", width: 20, height: 20, border: "1.5px solid #1a1b1c", transform: "rotate(45deg)", position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontSize: 9, color: "#1a1b1c", lineHeight: 1 }}>
        {dir === "left" ? "←" : "→"}
      </span>
    </span>
  );
}

const s = {
  screen: { background: "#fcfcfc", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", border: "1px solid #1a1b1c", cursor: "text" },
  header: { display: "flex", alignItems: "center", padding: "0 28px", height: 52, borderBottom: "1px solid rgba(26,27,28,0.12)", cursor: "default" },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c" },
  tag: { fontSize: 11, color: "rgba(26,27,28,0.5)", letterSpacing: "0.06em" },
  body: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" },
  startLabel: { position: "absolute", top: 20, left: 28, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  diamond: { width: 230, height: 230, transform: "rotate(45deg)", border: "1px dashed rgba(26,27,28,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
  inner: { transform: "rotate(-45deg)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" },
  clickLabel: { fontSize: 8, letterSpacing: "0.16em", color: "rgba(26,27,28,0.35)", textTransform: "uppercase", pointerEvents: "none" },
  activeLabel: { fontSize: 8, letterSpacing: "0.14em", color: "rgba(26,27,28,0.4)", textTransform: "uppercase", pointerEvents: "none" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", cursor: "default" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  proceedBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c", textTransform: "uppercase" },
};
