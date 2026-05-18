import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function DemographicsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const savedData = (() => { try { return JSON.parse(sessionStorage.getItem("skinstric_analysis") || "{}"); } catch { return {}; } })();
  const data = (state?.data && Object.keys(state.data).length > 0) ? state.data : savedData;
  const imageDataUrl = state?.imageDataUrl || sessionStorage.getItem("skinstric_image") || "";

  // Handle all known API response shapes
  const raw = data?.predictions ?? data?.outputs?.[0]?.data ?? data ?? {};
  const race = sortDesc(raw.race ?? raw.Race ?? data.race ?? data.Race ?? {});
  const age = sortDesc(raw.age ?? raw.Age ?? data.age ?? data.Age ?? {});
  const gender = sortDesc(raw.gender ?? raw.Gender ?? raw.sex ?? raw.Sex ?? data.gender ?? data.Gender ?? {});

  console.log("Demographics data:", { raw, race, age, gender });

  const [activeTab, setActiveTab] = useState("RACE");
  const [selected, setSelected] = useState({
    RACE: race[0]?.[0] ?? "",
    AGE: age[0]?.[0] ?? "",
    SEX: gender[0]?.[0] ?? "",
  });

  const tabs = { RACE: race, AGE: age, SEX: gender };
  const rows = tabs[activeTab] || [];
  const topScore = rows[0]?.[1] ?? 0;

  const reset = () => {
    setSelected({ RACE: race[0]?.[0] ?? "", AGE: age[0]?.[0] ?? "", SEX: gender[0]?.[0] ?? "" });
  };

  const confirm = () => {
    localStorage.setItem("skinstric_demographics", JSON.stringify(selected));
    navigate("/analysis", { state: { data, imageDataUrl } });
  };

  return (
    <div style={s.screen}>
      <header style={s.header}>
        <div style={s.hl}>
          <span style={s.brand}>SKINSTRIC</span>
          <span style={s.tag}>[ ANALYSIS ]</span>
        </div>
      </header>

      <main style={s.body}>
        <div style={s.titleBlock}>
          <p style={s.sectionLabel}>A.I. ANALYSIS</p>
          <div style={s.titleRow}>
            <button style={s.navArrow} onClick={() => navigate(-1)}>
              <MiniDiamond dir="left" />
            </button>
            <h1 style={s.heading}>DEMOGRAPHICS</h1>
            <button style={s.navArrow} onClick={() => navigate("/analysis/skin-type", { state: { data, imageDataUrl } })}>
              <MiniDiamond />
            </button>
          </div>
          <p style={s.subLabel}>PREDICTED RACE &amp; AGE</p>
        </div>

        <div style={s.columns}>
          {/* Left: tabs */}
          <aside style={s.sidebar}>
            {Object.keys(tabs).map((tab) => (
              <button
                key={tab}
                style={{ ...s.tabBtn, background: activeTab === tab ? "#1a1b1c" : "rgba(26,27,28,0.06)", color: activeTab === tab ? "#fcfcfc" : "#1a1b1c" }}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </aside>

          {/* Center: donut circle */}
          <div style={s.chartWrap}>
            <DonutChart score={topScore} />
          </div>

          {/* Right: confidence table */}
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <span style={s.tableHeaderCell}>{activeTab}</span>
              <span style={s.tableHeaderCell}>A.I. CONFIDENCE</span>
            </div>
            {rows.map(([label, score]) => {
              const isSelected = selected[activeTab] === label;
              return (
                <div
                  key={label}
                  style={{ ...s.tableRow, background: isSelected ? "#1a1b1c" : "transparent", cursor: "pointer" }}
                  onClick={() => setSelected((p) => ({ ...p, [activeTab]: label }))}
                >
                  <div style={s.rowLeft}>
                    <DiamondBullet filled={isSelected} />
                    <span style={{ ...s.rowLabel, color: isSelected ? "#fcfcfc" : "#1a1b1c" }}>{label}</span>
                  </div>
                  <div style={s.rowRight}>
                    <div style={s.barTrack}>
                      <div style={{ ...s.barFill, width: `${Math.round(score * 100)}%`, background: isSelected ? "#fcfcfc" : "#1a1b1c" }} />
                    </div>
                    <span style={{ ...s.rowScore, color: isSelected ? "#fcfcfc" : "#1a1b1c" }}>
                      {(score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p style={s.hint}>IF A.I. ESTIMATE IS WRONG, SELECT THE CORRECT ONE.</p>
      </main>

      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("/analysis", { state: { data, imageDataUrl } })}>
          <NavDiamond dir="left" /><span>BACK</span>
        </button>
        <div style={s.actionBtns}>
          <button style={s.resetBtn} onClick={reset}>RESET</button>
          <button style={s.confirmBtn} onClick={confirm}>CONFIRM</button>
        </div>
      </nav>
    </div>
  );
}

function DonutChart({ score }) {
  const R = 90, cx = 110, cy = 110;
  const circ = 2 * Math.PI * R;
  const dash = circ * score;
  return (
    <svg width={220} height={220} viewBox="0 0 220 220">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(26,27,28,0.08)" strokeWidth={1.5} />
      {score > 0 && (
        <circle
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke="#1a1b1c"
          strokeWidth={1.5}
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function DiamondBullet({ filled }) {
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, transform: "rotate(45deg)", border: `1px solid ${filled ? "#fcfcfc" : "#1a1b1c"}`, background: filled ? "#fcfcfc" : "transparent", flexShrink: 0 }} />
  );
}

function MiniDiamond({ dir }) {
  return (
    <span style={{ display: "inline-block", width: 16, height: 16, border: "1.5px solid #1a1b1c", transform: "rotate(45deg)", position: "relative", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-45deg)", fontSize: 8, color: "#1a1b1c", lineHeight: 1 }}>
        {dir === "left" ? "←" : "→"}
      </span>
    </span>
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

function sortDesc(obj) {
  if (!obj || typeof obj !== "object") return [];
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}

const s = {
  screen: { background: "#fcfcfc", minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans','Inter',sans-serif", border: "1px solid #1a1b1c" },
  header: { display: "flex", alignItems: "center", padding: "0 28px", height: 52, borderBottom: "1px solid rgba(26,27,28,0.12)" },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c" },
  tag: { fontSize: 11, color: "rgba(26,27,28,0.5)", letterSpacing: "0.06em" },
  body: { flex: 1, display: "flex", flexDirection: "column", padding: "20px 28px 8px", gap: 16 },
  titleBlock: { display: "flex", flexDirection: "column", gap: 2 },
  sectionLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  titleRow: { display: "flex", alignItems: "center", gap: 12 },
  heading: { fontSize: 42, fontWeight: 700, letterSpacing: "-0.01em", color: "#1a1b1c", margin: 0 },
  navArrow: { background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" },
  subLabel: { fontSize: 9, letterSpacing: "0.1em", color: "rgba(26,27,28,0.4)", textTransform: "uppercase" },
  columns: { flex: 1, display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: 24, alignItems: "start" },
  sidebar: { display: "flex", flexDirection: "column" },
  tabBtn: { height: 52, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", border: "none", cursor: "pointer", textAlign: "left", paddingLeft: 16, transition: "background 0.15s, color 0.15s" },
  chartWrap: { display: "flex", alignItems: "center", justifyContent: "center" },
  tableWrap: { display: "flex", flexDirection: "column" },
  tableHeader: { display: "flex", justifyContent: "space-between", padding: "6px 12px", borderBottom: "1px solid rgba(26,27,28,0.1)" },
  tableHeaderCell: { fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(26,27,28,0.4)", textTransform: "uppercase" },
  tableRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid rgba(26,27,28,0.06)", transition: "background 0.12s" },
  rowLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 120 },
  rowRight: { display: "flex", alignItems: "center", gap: 10, flex: 1, justifyContent: "flex-end" },
  barTrack: { width: 80, height: 2, background: "rgba(26,27,28,0.1)", borderRadius: 1, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 1, transition: "width 0.4s ease" },
  rowLabel: { fontSize: 11, letterSpacing: "0.04em" },
  rowScore: { fontSize: 11, fontFamily: "monospace", letterSpacing: "0.04em", minWidth: 44, textAlign: "right" },
  hint: { fontSize: 9, letterSpacing: "0.08em", color: "rgba(26,27,28,0.35)", textTransform: "uppercase", textAlign: "center" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", borderTop: "1px solid rgba(26,27,28,0.08)" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  actionBtns: { display: "flex", gap: 8 },
  resetBtn: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c", background: "none", border: "1px solid rgba(26,27,28,0.25)", cursor: "pointer", padding: "8px 20px", textTransform: "uppercase" },
  confirmBtn: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc", background: "#1a1b1c", border: "none", cursor: "pointer", padding: "8px 20px", textTransform: "uppercase" },
};
