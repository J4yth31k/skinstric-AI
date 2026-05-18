import { useLocation, useNavigate } from "react-router-dom";

const CATEGORIES = [
  { key: "demographics", label: "DEMOGRAPHICS", dx: 0, dy: -1 },
  { key: "skin-type", label: "SKIN TYPE\nDETAILS", dx: -1, dy: 0 },
  { key: "cosmetic", label: "COSMETIC\nCONCERNS", dx: 1, dy: 0 },
  { key: "weather", label: "WEATHER", dx: 0, dy: 1 },
];

export default function AnalysisHubPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const savedData = (() => { try { return JSON.parse(sessionStorage.getItem("skinstric_analysis") || "{}"); } catch { return {}; } })();
  const data = (state?.data && Object.keys(state.data).length > 0) ? state.data : savedData;
  const imageDataUrl = state?.imageDataUrl || sessionStorage.getItem("skinstric_image") || "";

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.hl}>
          <span style={s.brand}>SKINSTRIC</span>
          <span style={s.tag}>[ ANALYSIS ]</span>
        </div>
      </header>

      <main style={s.body}>
        <div style={s.info}>
          <p style={s.infoTitle}>A.I. ANALYSIS</p>
          <p style={s.infoSub}>A.I. HAS ESTIMATED THE FOLLOWING.</p>
          <p style={s.infoSub}>FIX ESTIMATED INFORMATION IF NEEDED.</p>
        </div>

        <div style={s.hubWrap}>
          <div style={s.outerDiamond}>
            {CATEGORIES.map(({ key, label, dx, dy }) => (
              <InnerDiamond
                key={key}
                label={label}
                dx={dx}
                dy={dy}
                onClick={() =>
                  navigate(`/analysis/${key}`, { state: { data, imageDataUrl } })
                }
              />
            ))}
          </div>
        </div>
      </main>

      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate(-1)}>
          <NavDiamond dir="left" /><span>BACK</span>
        </button>
        <button style={s.proceedBtn} onClick={() => navigate("/analysis/demographics", { state: { data, imageDataUrl } })}>
          <span>GET SUMMARY</span><NavDiamond />
        </button>
      </nav>
    </div>
  );
}

function InnerDiamond({ label, dx, dy, onClick }) {
  const SIZE = 300; // outer container px
  const C = SIZE / 2;
  const OFFSET = 72; // distance from center to inner diamond center
  const INNER = 88;  // inner diamond side length

  const cx = C + dx * OFFSET;
  const cy = C + dy * OFFSET;

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        width: INNER,
        height: INNER,
        top: cy - INNER / 2,
        left: cx - INNER / 2,
        transform: "rotate(45deg)",
        background: "rgba(26,27,28,0.07)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,27,28,0.14)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(26,27,28,0.07)")}
    >
      <span style={{ transform: "rotate(-45deg)", fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c", textTransform: "uppercase", textAlign: "center", lineHeight: 1.5, whiteSpace: "pre-line" }}>
        {label}
      </span>
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
  body: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 80, padding: "0 48px", position: "relative" },
  info: { position: "absolute", top: 20, left: 28, display: "flex", flexDirection: "column", gap: 4 },
  infoTitle: { fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#1a1b1c", textTransform: "uppercase" },
  infoSub: { fontSize: 9, letterSpacing: "0.08em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  hubWrap: { display: "flex", alignItems: "center", justifyContent: "center" },
  outerDiamond: {
    position: "relative",
    width: 300,
    height: 300,
    transform: "rotate(45deg)",
    border: "1px dashed rgba(26,27,28,0.2)",
  },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  proceedBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c", textTransform: "uppercase" },
};
