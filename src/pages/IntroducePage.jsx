import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroducePage() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => localStorage.getItem("skinstric_name") || "");
  const inputRef = useRef(null);

  const proceed = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem("skinstric_name", trimmed);
    navigate("/location");
  };

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.hl}>
          <span style={s.brand}>SKINSTRIC</span>
          <span style={s.tag}>[ INTRO ]</span>
        </div>
      </header>

      <main style={s.body} onClick={() => inputRef.current?.focus()}>
        <p style={s.startLabel}>TO START ANALYSIS</p>

        <div style={s.diamondWrap}>
          <div style={s.diamond}>
            <div style={s.inner}>
              {!name && <span style={s.clickLabel}>CLICK TO TYPE</span>}
              <span style={name ? s.typed : s.placeholder}>
                {name || "Introduce Yourself"}
              </span>
            </div>
          </div>
        </div>

        <input
          ref={inputRef}
          style={s.hidden}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && proceed()}
          autoFocus
        />
      </main>

      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("/")}>
          <NavDiamond dir="left" />
          <span>BACK</span>
        </button>
        {name.trim() && (
          <button style={s.proceedBtn} onClick={proceed}>
            <span>PROCEED</span>
            <NavDiamond />
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
  screen: { background: "#fcfcfc", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", border: "1px solid #1a1b1c" },
  header: { display: "flex", alignItems: "center", padding: "0 28px", height: 52, borderBottom: "1px solid rgba(26,27,28,0.12)" },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c" },
  tag: { fontSize: 11, color: "rgba(26,27,28,0.5)", letterSpacing: "0.06em" },
  body: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "text", position: "relative", padding: 24 },
  startLabel: { position: "absolute", top: 20, left: 28, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  diamondWrap: { display: "flex", alignItems: "center", justifyContent: "center" },
  diamond: { width: 230, height: 230, transform: "rotate(45deg)", border: "1px dashed rgba(26,27,28,0.3)", display: "flex", alignItems: "center", justifyContent: "center" },
  inner: { transform: "rotate(-45deg)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center", padding: "0 44px" },
  clickLabel: { fontSize: 8, letterSpacing: "0.16em", color: "rgba(26,27,28,0.35)", textTransform: "uppercase" },
  placeholder: { fontSize: 28, fontWeight: 300, color: "#1a1b1c", whiteSpace: "nowrap" },
  typed: { fontSize: 28, fontWeight: 300, color: "#1a1b1c", borderBottom: "1.5px solid #1a1b1c", paddingBottom: 2, whiteSpace: "nowrap" },
  hidden: { position: "fixed", opacity: 0, pointerEvents: "none", width: 1, height: 1 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  proceedBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c", textTransform: "uppercase" },
};
