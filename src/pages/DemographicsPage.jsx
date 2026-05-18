import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function DemographicsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const savedData = (() => {
    try { return JSON.parse(sessionStorage.getItem("skinstric_analysis") || "{}"); }
    catch { return {}; }
  })();
  const data = (state?.data && Object.keys(state.data).length > 0) ? state.data : savedData;
  const imageDataUrl = state?.imageDataUrl || sessionStorage.getItem("skinstric_image") || "";

  // API returns { success, data: { race, age, gender } }
  const raw = data?.data ?? data?.predictions ?? data ?? {};
  const race   = sortDesc(raw.race   ?? raw.Race   ?? {});
  const age    = sortDesc(raw.age    ?? raw.Age    ?? {});
  const gender = sortDesc(raw.gender ?? raw.Gender ?? raw.sex ?? raw.Sex ?? {});

  const tabs = { RACE: race, AGE: age, SEX: gender };

  const [activeTab, setActiveTab] = useState("RACE");
  const [selected, setSelected] = useState({
    RACE: race[0]?.[0] ?? "",
    AGE:  age[0]?.[0]  ?? "",
    SEX:  gender[0]?.[0] ?? "",
  });

  const rows = tabs[activeTab] || [];
  const topScore = rows[0]?.[1] ?? 0;
  const topPct   = Math.round(topScore * 100);

  const confirm = () => {
    localStorage.setItem("skinstric_demographics", JSON.stringify(selected));
    navigate("/analysis", { state: { data, imageDataUrl } });
  };

  const reset = () => {
    setSelected({
      RACE: race[0]?.[0] ?? "",
      AGE:  age[0]?.[0]  ?? "",
      SEX:  gender[0]?.[0] ?? "",
    });
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
        {/* Title block */}
        <div style={s.titleBlock}>
          <p style={s.sectionLabel}>A.I. ANALYSIS</p>
          <div style={s.titleRow}>
            <MiniDiamond dir="left" onClick={() => navigate(-1)} />
            <h1 style={s.heading}>DEMOGRAPHICS</h1>
            <MiniDiamond onClick={() => navigate("/analysis", { state: { data, imageDataUrl } })} />
          </div>
          <p style={s.subLabel}>PREDICTED RACE &amp; AGE</p>
        </div>

        <div style={s.columns}>
          {/* Left sidebar — predicted values */}
          <aside style={s.sidebar}>
            {[
              { tab: "RACE", value: selected.RACE },
              { tab: "AGE",  value: selected.AGE  },
              { tab: "SEX",  value: selected.SEX  },
            ].map(({ tab, value }) => {
              const active = activeTab === tab;
              return (
                <div key={tab} style={{ cursor: "pointer" }} onClick={() => setActiveTab(tab)}>
                  <div style={{ ...s.tabValue, background: active ? "#1a1b1c" : "rgba(26,27,28,0.06)", color: active ? "#fcfcfc" : "#1a1b1c" }}>
                    {value || "—"}
                  </div>
                  <div style={{ ...s.tabLabel, background: active ? "#2a2b2c" : "rgba(26,27,28,0.04)", color: active ? "rgba(252,252,252,0.5)" : "rgba(26,27,28,0.4)" }}>
                    {tab}
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Center — donut chart */}
          <div style={s.chartWrap}>
            <DonutChart score={topScore} pct={topPct} />
          </div>

          {/* Right — confidence table */}
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <span style={s.tableHeaderCell}>{activeTab}</span>
              <span style={s.tableHeaderCell}>A. I. CONFIDENCE</span>
            </div>
            {rows.map(([label, score]) => {
              const isSelected = selected[activeTab] === label;
              const pct = Math.round(score * 100);
              return (
                <div
                  key={label}
                  style={{ ...s.tableRow, background: isSelected ? "#1a1b1c" : "transparent" }}
                  onClick={() => setSelected((p) => ({ ...p, [activeTab]: label }))}
                >
                  <div style={s.rowLeft}>
                    <DiamondBullet filled={isSelected} />
                    <span style={{ ...s.rowLabel, color: isSelected ? "#fcfcfc" : "#1a1b1c" }}>{label}</span>
                  </div>
                  <span style={{ ...s.rowPct, color: isSelected ? "#fcfcfc" : "rgba(26,27,28,0.6)" }}>
                    {pct} %
                  </span>
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

function DonutChart({ score, pct }) {
  const R = 108, cx = 130, cy = 130;
  const circ = 2 * Math.PI * R;
  const filled = circ * Math.min(score, 1);
  return (
    <svg width={260} height={260} viewBox="0 0 260 260">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(26,27,28,0.08)" strokeWidth={1} />
      {score > 0 && (
        <circle
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke="#1a1b1c"
          strokeWidth={1.5}
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="butt"
        />
      )}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={40} fontWeight={300} fill="#1a1b1c" fontFamily="'DM Sans',sans-serif">
        {pct}
      </text>
      <text x={cx + 24} y={cy - 14} textAnchor="middle" fontSize={16} fontWeight={300} fill="#1a1b1c" fontFamily="'DM Sans',sans-serif">
        %
      </text>
    </svg>
  );
}

function DiamondBullet({ filled }) {
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, transform: "rotate(45deg)", border: `1px solid ${filled ? "#fcfcfc" : "#1a1b1c"}`, background: filled ? "#fcfcfc" : "transparent", flexShrink: 0 }} />
  );
}

function MiniDiamond({ dir, onClick }) {
  return (
    <span onClick={onClick} style={{ display: "inline-block", width: 18, height: 18, border: "1.5px solid #1a1b1c", transform: "rotate(45deg)", position: "relative", flexShrink: 0, cursor: "pointer" }}>
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
  header: { display: "flex", alignItems: "center", padding: "0 28px", height: 48, borderBottom: "1px solid rgba(26,27,28,0.12)" },
  hl: { display: "flex", alignItems: "center", gap: 10 },
  brand: { fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c" },
  tag: { fontSize: 11, color: "rgba(26,27,28,0.5)", letterSpacing: "0.06em" },
  body: { flex: 1, display: "flex", flexDirection: "column", padding: "16px 28px 8px", gap: 12 },
  titleBlock: { display: "flex", flexDirection: "column", gap: 2 },
  sectionLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase", margin: 0 },
  titleRow: { display: "flex", alignItems: "center", gap: 12 },
  heading: { fontSize: 40, fontWeight: 700, letterSpacing: "-0.01em", color: "#1a1b1c", margin: 0 },
  subLabel: { fontSize: 9, letterSpacing: "0.1em", color: "rgba(26,27,28,0.4)", textTransform: "uppercase", margin: 0 },
  columns: { flex: 1, display: "grid", gridTemplateColumns: "110px 1fr 320px", gap: 0, alignItems: "start", border: "1px solid rgba(26,27,28,0.1)" },
  sidebar: { display: "flex", flexDirection: "column", borderRight: "1px solid rgba(26,27,28,0.1)" },
  tabValue: { padding: "14px 16px", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", transition: "background 0.15s, color 0.15s" },
  tabLabel: { padding: "6px 16px 10px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", transition: "background 0.15s, color 0.15s", borderBottom: "1px solid rgba(26,27,28,0.08)" },
  chartWrap: { display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" },
  tableWrap: { display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(26,27,28,0.1)" },
  tableHeader: { display: "flex", justifyContent: "space-between", padding: "8px 16px", borderBottom: "1px solid rgba(26,27,28,0.1)" },
  tableHeaderCell: { fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(26,27,28,0.4)", textTransform: "uppercase" },
  tableRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid rgba(26,27,28,0.06)", cursor: "pointer", transition: "background 0.12s" },
  rowLeft: { display: "flex", alignItems: "center", gap: 10 },
  rowLabel: { fontSize: 11, letterSpacing: "0.02em" },
  rowPct: { fontSize: 11, fontFamily: "monospace", letterSpacing: "0.04em", minWidth: 40, textAlign: "right" },
  hint: { fontSize: 9, letterSpacing: "0.08em", color: "rgba(26,27,28,0.35)", textTransform: "uppercase", textAlign: "center", margin: 0 },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", borderTop: "1px solid rgba(26,27,28,0.08)" },
  backBtn: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(26,27,28,0.5)", textTransform: "uppercase" },
  actionBtns: { display: "flex", gap: 8 },
  resetBtn: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#1a1b1c", background: "none", border: "1px solid rgba(26,27,28,0.25)", cursor: "pointer", padding: "8px 20px", textTransform: "uppercase" },
  confirmBtn: { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#fcfcfc", background: "#1a1b1c", border: "none", cursor: "pointer", padding: "8px 20px", textTransform: "uppercase" },
};
